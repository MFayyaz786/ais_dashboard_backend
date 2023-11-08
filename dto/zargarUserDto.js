class UserDTO {
  constructor(user) {
    (this._id = user._id), (this.name = user.name), (this.phone = user.phone);
  }
}
module.exports = UserDTO;
