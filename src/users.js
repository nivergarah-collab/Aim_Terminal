// ============================================================
// VirtualUsers — Terminal Aim Trainer
// ============================================================

class VirtualUsers {
  constructor() {
    this.users   = [];
    this.groups  = [];
    this.current = 'user-ec2';
    this._init();
  }

  _init() {
    this.users = [
      { username:'root',     uid:0,    gid:0,    home:'/root',           shell:'/bin/bash', password:'' },
      { username:'user-ec2', uid:1000, gid:1000, home:'/home/user-ec2',  shell:'/bin/bash', password:'' },
    ];
    this.groups = [
      { name:'root',     gid:0,    members:['root'] },
      { name:'user-ec2', gid:1000, members:['user-ec2'] },
      { name:'sudo',     gid:27,   members:['user-ec2'] },
    ];
  }

  getUser(username) { return this.users.find(u => u.username === username) || null; }
  getGroup(name)    { return this.groups.find(g => g.name === name) || null; }

  groupsOf(username) {
    return this.groups.filter(g => g.members.includes(username)).map(g => g.name);
  }

  isSudo(username) {
    const g = this.getGroup('sudo');
    return username === 'root' || (g && g.members.includes(username));
  }

  currentUser()   { return this.getUser(this.current); }
  currentHome()   { return this.currentUser()?.home || '/home/user-ec2'; }
  currentGroups() { return this.groupsOf(this.current); }

  useradd(username, opts) {
    if (this.getUser(username)) return { ok: false, msg: `useradd: user '${username}' already exists` };
    const uid = Math.max(...this.users.map(u => u.uid)) + 1;
    const primaryGroup = opts.g || username;
    if (!this.getGroup(primaryGroup)) {
      const gid = Math.max(...this.groups.map(g => g.gid)) + 1;
      this.groups.push({ name: primaryGroup, gid, members: [] });
    }
    const gid = this.getGroup(primaryGroup).gid;
    const user = {
      username,
      uid,
      gid,
      home:     opts.m !== false ? `/home/${username}` : '/dev/null',
      shell:    opts.s || '/bin/sh',
      password: ''
    };
    this.users.push(user);
    this.getGroup(primaryGroup).members.push(username);
    for (const sg of (opts.G || [])) {
      const g = this.getGroup(sg);
      if (g && !g.members.includes(username)) g.members.push(username);
    }
    return { ok: true, home: user.home, primaryGroup };
  }

  userdel(username, removeHome) {
    if (!this.getUser(username)) return { ok: false, msg: `userdel: user '${username}' does not exist` };
    if (username === 'root') return { ok: false, msg: `userdel: user 'root' is not deletable` };
    this.users = this.users.filter(u => u.username !== username);
    for (const g of this.groups) g.members = g.members.filter(m => m !== username);
    return { ok: true, removeHome };
  }

  groupadd(name) {
    if (this.getGroup(name)) return { ok: false, msg: `groupadd: group '${name}' already exists` };
    const gid = Math.max(...this.groups.map(g => g.gid)) + 1;
    this.groups.push({ name, gid, members: [] });
    return { ok: true };
  }

  groupdel(name) {
    if (!this.getGroup(name)) return { ok: false, msg: `groupdel: group '${name}' does not exist` };
    const isPrimary = this.users.some(u => this.getGroup(name)?.gid === u.gid);
    if (isPrimary) return { ok: false, msg: `groupdel: cannot remove the primary group of user` };
    this.groups = this.groups.filter(g => g.name !== name);
    return { ok: true };
  }

  usermod(username, opts) {
    const user = this.getUser(username);
    if (!user) return { ok: false, msg: `usermod: user '${username}' does not exist` };
    if (opts.aG) {
      for (const gname of opts.aG) {
        const g = this.getGroup(gname);
        if (!g) return { ok: false, msg: `usermod: group '${gname}' does not exist` };
        if (!g.members.includes(username)) g.members.push(username);
      }
    }
    if (opts.g) {
      const g = this.getGroup(opts.g);
      if (!g) return { ok: false, msg: `usermod: group '${opts.g}' does not exist` };
      user.gid = g.gid;
    }
    if (opts.s) user.shell = opts.s;
    if (opts.d) user.home  = opts.d;
    return { ok: true };
  }

  su(username, password) {
    const user = this.getUser(username);
    if (!user) return { ok: false, msg: `su: user ${username} does not exist` };
    if (user.password && user.password !== password)
      return { ok: false, msg: 'su: Authentication failure' };
    this.current = username;
    return { ok: true, home: user.home };
  }

  passwd(username, newPass) {
    const user = this.getUser(username);
    if (!user) return { ok: false, msg: `passwd: user '${username}' does not exist` };
    user.password = newPass || '';
    return { ok: true };
  }

  whoami() { return this.current; }

  id(username) {
    const u = this.getUser(username || this.current);
    if (!u) return { ok: false, msg: `id: '${username}': no such user` };
    const primaryGroup = this.groups.find(g => g.gid === u.gid) || { name: u.username, gid: u.gid };
    const allGroups = this.groups.filter(g => g.members.includes(u.username));
    const gStr = allGroups.map(g => `${g.gid}(${g.name})`).join(',');
    return { ok: true, line: `uid=${u.uid}(${u.username}) gid=${u.gid}(${primaryGroup.name}) groups=${gStr}` };
  }

  initFromSpec(spec) {
    this._init();
    for (const u of (spec.usuarios || [])) {
      if (!this.getUser(u.username)) this.useradd(u.username, { m: true, s: u.shell || '/bin/bash', g: u.group });
      for (const sg of (u.grupos || [])) {
        if (!this.getGroup(sg)) this.groupadd(sg);
        const g = this.getGroup(sg);
        if (!g.members.includes(u.username)) g.members.push(u.username);
      }
    }
    for (const g of (spec.grupos || [])) {
      if (!this.getGroup(g.name)) this.groupadd(g.name);
    }
    this.current = spec.usuarioActual || 'user-ec2';
  }
}
