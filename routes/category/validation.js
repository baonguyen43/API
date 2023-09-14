const yup = require("yup");

const validationSchema = yup.object().shape({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên quá dài")
      .required("Tên không được bỏ trống"),
    description: yup
      .string()
      .max(3000, "Mô tả quá dài")
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    // isDeleted: yup.boolean().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});

module.exports = {
  validationSchema,
};
