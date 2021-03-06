import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowedNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowedNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    }
  });

  User.beforeCreate(async user => {
    user.password = await generatePasswordHash(user.password)
  });

  const generatePasswordHash = async function(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  User.associate = models => {
    User.hasMany(models.Donate);
    User.hasMany(models.Donate, { foreignKey: "donateTo" });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  return User;
};

export default user;
