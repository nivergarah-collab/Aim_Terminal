// ============================================================
// VirtualFS — Terminal Aim Trainer
// ============================================================

class VirtualNode {
  constructor({ name, type, owner, group, perms, content = '', mtime = null }) {
    this.name     = name;
    this.type     = type;       // 'file' | 'dir' | 'symlink'
    this.owner    = owner;
    this.group    = group;
    this.perms    = perms;      // 9-char string: 'rwxr-xr-x'
    this.content  = content;
    this.children = {};         // only dirs
    this.size     = type === 'file' ? content.length : 4096;
    this.mtime    = mtime || new Date().toISOString();
    this.linkTarget = null;     // symlinks only
  }

  permOctal() {
    const p = this.perms;
    const val = c => c === '-' ? 0 : c === 'r' ? 4 : c === 'w' ? 2 : 1;
    const tri = s => val(s[0]) + val(s[1]) + val(s[2]);
    return `${tri(p.slice(0,3))}${tri(p.slice(3,6))}${tri(p.slice(6,9))}`;
  }

  lsLong(linkCount = 1) {
    const t = this.type === 'dir' ? 'd' : this.type === 'symlink' ? 'l' : '-';
    const dt = new Date(this.mtime);
    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()];
    const day = String(dt.getDate()).padStart(2, ' ');
    const time = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
    const sz = String(this.size).padStart(5, ' ');
    return `${t}${this.perms} ${String(linkCount).padStart(2,' ')} ${this.owner.padEnd(8,' ')} ${this.group.padEnd(8,' ')} ${sz} ${mon} ${day} ${time} ${this.name}`;
  }
}

class VirtualFS {
  constructor() {
    this.root = new VirtualNode({ name:'/', type:'dir', owner:'root', group:'root', perms:'rwxr-xr-x' });
    this._cwd = '/';
    this._initStructure();
  }

  _initStructure() {
    this._mkdir('/home',          'root',     'root',     'rwxr-xr-x');
    this._mkdir('/home/user-ec2', 'user-ec2', 'user-ec2', 'rwxr-xr-x');
    this._mkdir('/etc',           'root',     'root',     'rwxr-xr-x');
    this._mkdir('/var',        'root', 'root', 'rwxr-xr-x');
    this._mkdir('/var/log',    'root', 'root', 'rwxr-xr-x');
    this._mkdir('/tmp',        'root', 'root', 'rwxrwxrwx');
    this._mkdir('/usr',        'root', 'root', 'rwxr-xr-x');
    this._mkdir('/usr/bin',    'root', 'root', 'rwxr-xr-x');
    this._mkdir('/opt',        'root', 'root', 'rwxr-xr-x');
    this._mkdir('/srv',        'root', 'root', 'rwxr-xr-x');
    this._mkdir('/root',       'root', 'root', 'rwx------');
    this._touch('/etc/hosts',  'root', 'root', 'rw-r--r--', '127.0.0.1 localhost\n');
    this._touch('/etc/passwd', 'root', 'root', 'rw-r--r--', 'root:x:0:0:root:/root:/bin/bash\nuser-ec2:x:1000:1000::/home/user-ec2:/bin/bash\n');
    this._touch('/etc/group',  'root', 'root', 'rw-r--r--', 'root:x:0:\nuser-ec2:x:1000:\n');
  }

  // ── Resolución de rutas ──────────────────────────────────
  resolve(path, cwd, homeDir) {
    if (!path || path === '~') return homeDir || '/home/user-ec2';
    if (path.startsWith('~/'))  return homeDir + path.slice(1);
    if (path.startsWith('/'))   return this._normalize(path);
    return this._normalize((cwd === '/' ? '' : cwd) + '/' + path);
  }

  _normalize(path) {
    const parts = path.split('/').filter(Boolean);
    const out = [];
    for (const p of parts) {
      if (p === '.')  continue;
      if (p === '..') { out.pop(); continue; }
      out.push(p);
    }
    return '/' + out.join('/');
  }

  _getNode(path) {
    if (path === '/') return this.root;
    const parts = path.split('/').filter(Boolean);
    let node = this.root;
    for (const p of parts) {
      if (!node.children || !node.children[p]) return null;
      node = node.children[p];
    }
    return node;
  }

  _getParent(path) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return null;
    const parentPath = '/' + parts.slice(0, -1).join('/');
    return { node: this._getNode(parentPath || '/'), name: parts[parts.length - 1] };
  }

  // ── Permisos ─────────────────────────────────────────────
  _parsePerm(perms, who) {
    const slice = { u: perms.slice(0,3), g: perms.slice(3,6), o: perms.slice(6,9) };
    return slice[who] || '---';
  }

  canRead(node, username, userGroups) {
    if (username === 'root') return true;
    if (node.owner === username) return node.perms[0] === 'r';
    if (userGroups.includes(node.group)) return node.perms[3] === 'r';
    return node.perms[6] === 'r';
  }

  canWrite(node, username, userGroups) {
    if (username === 'root') return true;
    if (node.owner === username) return node.perms[1] === 'w';
    if (userGroups.includes(node.group)) return node.perms[4] === 'w';
    return node.perms[7] === 'w';
  }

  canExecute(node, username, userGroups) {
    if (username === 'root') return true;
    if (node.owner === username) return node.perms[2] === 'x';
    if (userGroups.includes(node.group)) return node.perms[5] === 'x';
    return node.perms[8] === 'x';
  }

  // ── chmod ─────────────────────────────────────────────────
  chmod(path, mode, cwd, homeDir) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `chmod: cannot access '${path}': No such file or directory` };

    if (/^\d+$/.test(mode)) {
      const digits = mode.padStart(4, '0');
      const special = parseInt(digits[0]);
      const oct = digits.slice(-3);
      const toRwx = n => {
        const d = parseInt(n);
        return (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-');
      };
      let perms = toRwx(oct[0]) + toRwx(oct[1]) + toRwx(oct[2]);
      if (special & 4) perms = perms.slice(0, 2) + (perms[2] === 'x' ? 's' : 'S') + perms.slice(3);
      if (special & 2) perms = perms.slice(0, 5) + (perms[5] === 'x' ? 's' : 'S') + perms.slice(6);
      if (special & 1) perms = perms.slice(0, 8) + (perms[8] === 'x' ? 't' : 'T');
      node.perms = perms;
    } else {
      const parts = mode.split(',');
      for (const part of parts) {
        const m = part.match(/^([ugoa]*)([+\-=])([rwxts]*)$/);
        if (!m) return { ok: false, msg: `chmod: invalid mode: '${mode}'` };
        let [, who, op, bits] = m;
        if (!who || who === 'a') who = 'ugo';
        const p = node.perms.split('');
        const offsets = { u: [0,1,2], g: [3,4,5], o: [6,7,8] };
        const bitChar = { r: 'r', w: 'w', x: 'x' };
        const bitOff  = { r: 0,   w: 1,   x: 2   };
        for (const w of who.split('').filter(c => offsets[c])) {
          const base = offsets[w][0];
          if (op === '=') { p[base] = '-'; p[base+1] = '-'; p[base+2] = '-'; }
          for (const b of bits.split('')) {
            if (b === 't') {
              if (op === '+' || op === '=') p[8] = p[8] === 'x' ? 't' : 'T';
              if (op === '-') p[8] = p[8] === 't' ? 'x' : (p[8] === 'T' ? '-' : p[8]);
            } else if (b === 's') {
              const sIdx = w === 'u' ? 2 : w === 'g' ? 5 : -1;
              if (sIdx >= 0) {
                if (op === '+' || op === '=') p[sIdx] = p[sIdx] === 'x' ? 's' : 'S';
                if (op === '-') p[sIdx] = p[sIdx] === 's' ? 'x' : (p[sIdx] === 'S' ? '-' : p[sIdx]);
              }
            } else {
              const idx = base + bitOff[b];
              if (idx !== undefined) {
                if (op === '+' || op === '=') p[idx] = bitChar[b];
                if (op === '-') p[idx] = '-';
              }
            }
          }
        }
        node.perms = p.join('');
      }
    }
    node.mtime = new Date().toISOString();
    return { ok: true };
  }

  // ── Operaciones básicas ───────────────────────────────────
  _mkdir(absPath, owner, group, perms) {
    const parts = absPath.split('/').filter(Boolean);
    let node = this.root;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!node.children[p]) {
        node.children[p] = new VirtualNode({
          name: p, type: 'dir', owner, group, perms,
          mtime: new Date().toISOString()
        });
      }
      node = node.children[p];
    }
    return node;
  }

  _touch(absPath, owner, group, perms, content = '') {
    const { node: parent, name } = this._getParent(absPath);
    if (!parent) return null;
    parent.children[name] = new VirtualNode({ name, type:'file', owner, group, perms, content });
    return parent.children[name];
  }

  mkdir(path, opts, cwd, homeDir, owner, group) {
    const abs = this.resolve(path, cwd, homeDir);
    if (opts.p) {
      this._mkdir(abs, owner, group, 'rwxr-xr-x');
      return { ok: true };
    }
    const { node: parent, name } = this._getParent(abs);
    if (!parent) return { ok: false, msg: `mkdir: cannot create directory '${path}': No such file or directory` };
    if (parent.children[name]) return { ok: false, msg: `mkdir: cannot create directory '${path}': File exists` };
    parent.children[name] = new VirtualNode({ name, type:'dir', owner, group, perms: opts.m || 'rwxr-xr-x' });
    return { ok: true };
  }

  touch(path, cwd, homeDir, owner, group) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (node) { node.mtime = new Date().toISOString(); return { ok: true }; }
    const { node: parent, name } = this._getParent(abs);
    if (!parent) return { ok: false, msg: `touch: cannot touch '${path}': No such file or directory` };
    parent.children[name] = new VirtualNode({ name, type:'file', owner, group, perms:'rw-r--r--', content:'' });
    return { ok: true };
  }

  rm(path, opts, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `rm: cannot remove '${path}': No such file or directory` };
    if (node.type === 'dir' && !opts.r) return { ok: false, msg: `rm: cannot remove '${path}': Is a directory` };
    const { node: parent, name } = this._getParent(abs);
    if (!this.canWrite(parent, username, userGroups)) return { ok: false, msg: `rm: cannot remove '${path}': Permission denied` };
    delete parent.children[name];
    return { ok: true };
  }

  mv(src, dst, cwd, homeDir, username, userGroups) {
    const absSrc = this.resolve(src, cwd, homeDir);
    const srcNode = this._getNode(absSrc);
    if (!srcNode) return { ok: false, msg: `mv: cannot stat '${src}': No such file or directory` };
    let absDst = this.resolve(dst, cwd, homeDir);
    const dstNode = this._getNode(absDst);
    if (dstNode && dstNode.type === 'dir') absDst = absDst + '/' + srcNode.name;
    const { node: dstParent, name: dstName } = this._getParent(absDst);
    if (!dstParent) return { ok: false, msg: `mv: cannot move '${src}' to '${dst}': No such file or directory` };
    if (!this.canWrite(dstParent, username, userGroups)) return { ok: false, msg: `mv: cannot move '${src}': Permission denied` };
    const { node: srcParent, name: srcName } = this._getParent(absSrc);
    srcNode.name = dstName;
    dstParent.children[dstName] = srcNode;
    delete srcParent.children[srcName];
    return { ok: true };
  }

  cp(src, dst, opts, cwd, homeDir, username, userGroups) {
    const absSrc  = this.resolve(src, cwd, homeDir);
    const srcNode = this._getNode(absSrc);
    if (!srcNode) return { ok: false, msg: `cp: cannot stat '${src}': No such file or directory` };
    if (srcNode.type === 'dir' && !opts.r) return { ok: false, msg: `cp: -r not specified; omitting directory '${src}'` };
    let absDst = this.resolve(dst, cwd, homeDir);
    const dstNode = this._getNode(absDst);
    if (dstNode && dstNode.type === 'dir') absDst = absDst + '/' + srcNode.name;
    const { node: dstParent, name: dstName } = this._getParent(absDst);
    if (!dstParent) return { ok: false, msg: `cp: cannot copy to '${dst}': No such file or directory` };
    dstParent.children[dstName] = this._deepCopy(srcNode, dstName, username, opts.a);
    return { ok: true };
  }

  _deepCopy(node, newName, owner, preserveAttrs) {
    const copy = new VirtualNode({
      name:  newName,
      type:  node.type,
      owner: preserveAttrs ? node.owner : owner,
      group: node.group,
      perms: node.perms,
      content: node.content,
      mtime: preserveAttrs ? node.mtime : new Date().toISOString()
    });
    if (node.type === 'dir') {
      for (const [k, child] of Object.entries(node.children)) {
        copy.children[k] = this._deepCopy(child, k, owner, preserveAttrs);
      }
    }
    return copy;
  }

  ls(path, opts, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path || cwd, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `ls: cannot access '${path}': No such file or directory` };
    if (!this.canRead(node, username, userGroups)) return { ok: false, msg: `ls: cannot open directory '${path}': Permission denied` };

    if (node.type === 'file') {
      return { ok: true, lines: opts.l ? [node.lsLong()] : [node.name] };
    }

    let entries = Object.values(node.children);
    if (opts.a) {
      entries = [
        new VirtualNode({ name:'.', type:'dir', owner:node.owner, group:node.group, perms:node.perms }),
        new VirtualNode({ name:'..', type:'dir', owner:'root', group:'root', perms:'rwxr-xr-x' }),
        ...entries
      ];
    }
    if (!opts.a) entries = entries.filter(e => !e.name.startsWith('.'));

    if (opts.l) {
      const total = entries.length * 8;
      const lines = [`total ${total}`];
      for (const e of entries) {
        const lc = e.type === 'dir' ? Object.keys(e.children || {}).length + 2 : 1;
        lines.push(e.lsLong(lc));
      }
      return { ok: true, lines };
    }

    return { ok: true, lines: [entries.map(e => e.type === 'dir' ? e.name + '/' : e.name).join('  ')] };
  }

  cd(path, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path || homeDir, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `bash: cd: ${path}: No such file or directory` };
    if (node.type !== 'dir') return { ok: false, msg: `bash: cd: ${path}: Not a directory` };
    if (!this.canExecute(node, username, userGroups)) return { ok: false, msg: `bash: cd: ${path}: Permission denied` };
    return { ok: true, newCwd: abs };
  }

  cat(path, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `cat: ${path}: No such file or directory` };
    if (node.type === 'dir') return { ok: false, msg: `cat: ${path}: Is a directory` };
    if (!this.canRead(node, username, userGroups)) return { ok: false, msg: `cat: ${path}: Permission denied` };
    return { ok: true, content: node.content };
  }

  writeFile(path, content, append, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (node) {
      if (!this.canWrite(node, username, userGroups)) return { ok: false, msg: `bash: ${path}: Permission denied` };
      node.content = append ? node.content + content : content;
      node.size    = node.content.length;
      node.mtime   = new Date().toISOString();
      return { ok: true };
    }
    const { node: parent, name } = this._getParent(abs);
    if (!parent) return { ok: false, msg: `bash: ${path}: No such file or directory` };
    if (!this.canWrite(parent, username, userGroups)) return { ok: false, msg: `bash: ${path}: Permission denied` };
    parent.children[name] = new VirtualNode({ name, type:'file', owner:username, group:username, perms:'rw-r--r--', content });
    return { ok: true };
  }

  chown(path, newOwner, newGroup, opts, cwd, homeDir) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `chown: cannot access '${path}': No such file or directory` };
    if (newOwner) node.owner = newOwner;
    if (newGroup) node.group = newGroup;
    if (opts.R && node.type === 'dir') {
      for (const child of Object.values(node.children)) {
        if (newOwner) child.owner = newOwner;
        if (newGroup) child.group = newGroup;
      }
    }
    node.mtime = new Date().toISOString();
    return { ok: true };
  }

  ln(target, link, symbolic, cwd, homeDir, owner, group) {
    const absTarget = this.resolve(target, cwd, homeDir);
    const absLink   = this.resolve(link, cwd, homeDir);
    const { node: parent, name } = this._getParent(absLink);
    if (!parent) return { ok: false, msg: `ln: failed to create link '${link}': No such file or directory` };
    const node = new VirtualNode({ name, type: symbolic ? 'symlink' : 'file', owner, group, perms: 'rwxrwxrwx', content: '' });
    node.linkTarget = absTarget;
    parent.children[name] = node;
    return { ok: true };
  }

  truncate(path, cwd, homeDir, username, userGroups) {
    const abs  = this.resolve(path, cwd, homeDir);
    const node = this._getNode(abs);
    if (!node) return { ok: false, msg: `${path}: No such file or directory` };
    if (!this.canWrite(node, username, userGroups)) return { ok: false, msg: `${path}: Permission denied` };
    node.content = ''; node.size = 0;
    return { ok: true };
  }

  _octalToRwx(perms) {
    if (!perms) return null;
    if (/^[rwx-]{9}$/.test(perms)) return perms; // ya está en formato correcto
    const oct = String(perms).padStart(3, '0').slice(-3);
    const d = n => parseInt(n);
    const t = n => (d(n) & 4 ? 'r' : '-') + (d(n) & 2 ? 'w' : '-') + (d(n) & 1 ? 'x' : '-');
    return t(oct[0]) + t(oct[1]) + t(oct[2]);
  }

  initFromSpec(spec) {
    this.root = new VirtualNode({ name:'/', type:'dir', owner:'root', group:'root', perms:'rwxr-xr-x' });
    this._initStructure();
    for (const d of (spec.dirs || [])) {
      this._mkdir(d.path, d.owner || 'root', d.group || 'root', this._octalToRwx(d.perms) || 'rwxr-xr-x');
    }
    for (const f of (spec.files || [])) {
      this._touch(f.path, f.owner || 'root', f.group || 'root', this._octalToRwx(f.perms) || 'rw-r--r--', f.content || '');
    }
  }
}
