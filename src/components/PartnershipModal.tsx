import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnershipModal({ isOpen, onClose }: PartnershipModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Modal Overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">PCMAP 입점 안내</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col gap-8">
                <p className="text-slate-600 font-medium text-center text-[15px] leading-relaxed">
                  지역 내 가장 눈에 띄게 수리점을 홍보하세요.<br />
                  간단한 3단계로 바로 입점이 완료됩니다!
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">카카오톡 문의하기</h4>
                      <p className="text-sm text-slate-500">하단 버튼을 눌러 공식 오픈채팅으로 문의를 남겨주세요.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">매장 정보 전달</h4>
                      <p className="text-sm text-slate-500">매장 상호명, 주소, 전문 작업 태그, 네이버 플레이스 주소를 전달해주세요.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">당일 입점 완료! 🎉</h4>
                      <p className="text-sm text-emerald-700/80">정보 확인 후 즉시 PCMAP에 매장이 등록되어 노출됩니다.</p>
                    </div>
                  </div>
                </div>

                {/* Kakao CTA Button */}
                <a
                  href="https://open.kakao.com/o/sIng9Dfi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] active:bg-[#E5C700] text-[#191919] rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  <MessageCircle className="w-5 h-5" fill="#191919" />
                  1:1 입점 문의하기
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
