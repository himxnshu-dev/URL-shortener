const z = require("zod");

const emailValidation = z
  .string()
  .email({message: "Invalid email format"})
  // This regex checks for a standard email pattern: user@domain.extension
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Email must be a valid address with a domain.",
  });

const signupValidationSchema = z.object({
  name: z.string().min(2, {message: "Name must be at least 2 characters"}),
  // ✅ UPDATE THIS LINE
  email: emailValidation,
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters"}),
});
const signinValidationSchema = z.object({
  email: emailValidation,
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters"}),
});

module.exports = signinValidationSchema, signupValidationSchema