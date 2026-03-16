"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import PartnershipModal from "./PartnershipModal";

export default function FloatingInquiry() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 z-40 p-4 bg-[#FEE500] text-[#191919] rounded-full shadow-xl hover:bg-[#FADA0A] transition-colors duration-300 flex items-center justify-center border border-yellow-400/50"
        aria-label="Partnership Inquiry"
      >
        <MessageCircle className="w-6 h-6" fill="#191919" />
      </motion.button>

      <PartnershipModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
