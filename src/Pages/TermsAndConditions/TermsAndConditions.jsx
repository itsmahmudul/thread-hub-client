import React from "react";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";

const TermsAndConditions = () => {
  const { darkMode } = useAuth();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200"
          : "bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r bg-clip-text text-transparent ${
            darkMode
              ? "from-indigo-400 to-purple-400"
              : "from-indigo-500 to-purple-600"
          }`}
        >
          Terms & Conditions
        </motion.h1>

        {/* Intro */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-lg text-center mb-10 max-w-2xl mx-auto"
        >
          Welcome to <span className="font-semibold">My Thread Hub</span>. By
          using our forum, you agree to comply with and be bound by the
          following terms and conditions.
        </motion.p>

        {/* Sections */}
        <div className="space-y-8">
          {[
            {
              title: "1. User Accounts",
              content:
                "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
            },
            {
              title: "2. Forum Usage",
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Do not post harmful, abusive, or illegal content.</li>
                  <li>Respect other members and their opinions.</li>
                  <li>Do not spam or advertise without permission.</li>
                </ul>
              ),
            },
            {
              title: "3. Content Ownership",
              content:
                "Any content you post remains yours, but you grant My Thread Hub the right to display, distribute, and promote your content within the platform.",
            },
            {
              title: "4. Changes to Terms",
              content:
                "We may update these terms from time to time. Continued use of the forum constitutes acceptance of the new terms.",
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 ${
                darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-3 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                {section.title}
              </h2>
              <div className="text-base leading-relaxed">{section.content}</div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-12 text-sm text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Last updated: {new Date().toLocaleDateString()}
        </motion.p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
