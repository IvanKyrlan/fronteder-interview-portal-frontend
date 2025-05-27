import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaPaperPlane,
  FaSyncAlt,
  FaCheck,
} from "react-icons/fa";

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agreement: false,
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    document.title = "Контакти | Frontender - Підготовка до співбесід";

    window.scrollTo(0, 0);

    return () => {
      document.title = "Frontender";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormStatus({ ...formStatus, loading: true });

    setTimeout(() => {
      setFormStatus({
        submitted: true,
        loading: false,
        success: true,
        error: null,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        agreement: false,
      });

      setTimeout(() => {
        setFormStatus((prev) => ({
          ...prev,
          submitted: false,
          success: false,
        }));
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Контакти</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Зв'яжіться з нами, щоб отримати додаткову інформацію, залишити
            відгук або запропонувати співпрацю. Ми завжди відкриті до
            спілкування!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Контактна інформація
                </h2>

                <div className="space-y-6 ">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:clg-math@chnu.edu.ua"
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        clg-math@chnu.edu.ua
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaPhoneAlt size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Телефон
                      </h3>
                      <a
                        href="tel:+380123456789"
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        (0372) 58-48-80
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start  ">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Адреса
                      </h3>
                      <p className="text-gray-600">
                        м. Чернівці, вул. Університетська, 28
                        <br />
                        Факультет математики та інформатики
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Напишіть нам
                </h2>

                {formStatus.success ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6 flex items-center">
                    <FaCheck className="text-green-500 mr-3" size={24} />
                    <div>
                      <h3 className="font-semibold text-green-700">
                        Повідомлення надіслано!
                      </h3>
                      <p>
                        Дякуємо за ваше звернення. Ми зв'яжемося з вами
                        якнайшвидше.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-700 mb-2"
                        >
                          Ваше ім'я
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
                          placeholder="Введіть ваше ім'я"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-gray-700  mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
                          placeholder="Введіть ваш email"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-gray-700  mb-2"
                      >
                        Тема
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
                        placeholder="Тема вашого повідомлення"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-gray-700  mb-2"
                      >
                        Повідомлення
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500"
                        placeholder="Ваше повідомлення..."
                      ></textarea>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreement"
                          name="agreement"
                          type="checkbox"
                          checked={formData.agreement}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                        />
                      </div>
                      <div className="ml-3 text-sm ">
                        <label htmlFor="agreement" className="text-gray-600">
                          Я погоджуюсь з{" "}
                          <a
                            href="/#"
                            className="text-amber-600 hover:text-amber-700 underline-none"
                          >
                            політикою конфіденційності
                          </a>{" "}
                          та даю згоду на обробку моїх персональних даних
                        </label>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base  rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                        disabled={formStatus.loading}
                      >
                        {formStatus.loading ? (
                          <>
                            <FaSyncAlt className="animate-spin mr-2" />
                            Відправляємо...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2" />
                            Надіслати повідомлення
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-amber-500 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4 w-full text-center">
            Зробіть свій внесок у розвиток проекту
          </h2>
          <p className="text-lg text-gray-100 mb-8 w-full text-center">
            Допоможіть зробити портал кращим! Ви можете долучитися до покращення
            платформи: оновлюйте код, додавайте новий контент, пропонуйте ідеї
            або вдосконалюйте існуючі розділи. Разом ми зможемо створити ще
            ефективніше середовище для підготовки до Frontend співбесід.
          </p>
          <div className="w-full flex justify-center mt-8">
            <a
              href="https://github.com/IvanKyrlan/fronteder-interview-portal-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="w-24 h-24 rounded-full bg-white text-neutral-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-lg"
            >
              <FaGithub size={48} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
