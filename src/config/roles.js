const allRoles = {
  user: ['user'],
  broker: ['broker'],
  admin: ['admin'],
  premarket: ['premarket'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
