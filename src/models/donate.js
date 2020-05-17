const donate = (sequelize, DataTypes) => {
  const Donate = sequelize.define('donate', {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A message has to have a text'
        }
      },
    },
    donation: {
      type: DataTypes.INTEGER,
      allowedNull: false
    }
  });

  Donate.associate = models => {
    Donate.belongsTo(models.User);
    Donate.belongsTo(models.User, {
      foreignKey: "donateTo"
    });
  };

  return Donate;
};

export default donate;