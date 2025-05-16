import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Container } from "react-bootstrap";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setStatus("Please, confirm captcha.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        {
          email,
          message,
          captchaToken,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );

      setStatus(response.data.message);
      setEmail("");
      setMessage("");
      setCaptchaToken(null);
    } catch (error) {
      setStatus(error.response?.data?.error || "Error");
    }
  };

  return (
    <Container
      style={{ maxWidth: "900px", margin: "0 auto" }}
      className="py-12"
    >
      <div className="flex flex-col items-start text-left">
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p className="text-sm">Email: outlandscontacts@gmail.com</p>
          <p className="text-sm">Phone: +1 (234) 567-8901</p>
          <p className="text-sm">
            Address: 123 Main Street, Suite 100
            <br />
            Cityville, State 12345
            <br />
            Estonia
          </p>
        </section>

        <section className="w-full max-w-md">
          <h2 className="text-lg font-semibold mt-4">Contact us</h2>
          <p className="text-sm mb-6 text-gray-600">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out to us.
          </p>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-lg px-4 py-2 w-75 h-35"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupMessage">
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border rounded-lg px-4 py-2 w-75 h-75"
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex" controlId="formGroupCaptcha">
              <ReCAPTCHA
                sitekey="6Leh7yIrAAAAAImV9T4ysBEazp4f8i6yibrz1DYa"
                onChange={(token) => setCaptchaToken(token)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupSubmit">
              <button
                type="submit"
                className="bg-black text-white rounded py-2 px-4"
              >
                Submit
              </button>
            </Form.Group>
          </Form>
          {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}
        </section>
      </div>
    </Container>
  );
}
