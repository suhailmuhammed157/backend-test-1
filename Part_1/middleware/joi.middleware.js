const Joi = require("joi");
const middleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      console.log(details);
      var message;
      switch (details[0].type) {
        case "string.pattern.base":
          message = details[0].context.label + " contains special character";
          break;
        case "any.required":
          message = details[0].context.label + " is required";
          break;
        default:
          message = "not unix time";
      }
      res.status(422).json({ error: message });
    }
  };
};
module.exports = middleware;
