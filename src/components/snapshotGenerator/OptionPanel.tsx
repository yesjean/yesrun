/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import RecordOptions from "./RecordOptions";
import TextOptions from "./TextOptions";

type Props = {
    activeMenu: "record" | "text" | null;
    selectedBox: { type: "record" } | { type: "text"; id: number } | null;
    texts: any[];
    updateText: (id: number, newProps: any) => void;

    // record 옵션용 state
    recordColor: string;
    setRecordColor: (v: string) => void;
    recordBgColor: string;
    setRecordBgColor: (v: string) => void;
    recordBgAlpha: number;
    setRecordBgAlpha: (v: number) => void;
    recordBgTransparent: boolean;
    setRecordBgTransparent: (v: boolean) => void;
};

export default function OptionPanel({
    activeMenu,
    selectedBox,
    texts,
    updateText,
    recordColor,
    setRecordColor,
    recordBgColor,
    setRecordBgColor,
    recordBgAlpha,
    setRecordBgAlpha,
    recordBgTransparent,
    setRecordBgTransparent,
}: Props) {
    return (
        <AnimatePresence>
            {activeMenu === "record" && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="fixed inset-x-0 bottom-16 bg-white shadow-lg p-4 rounded-t-2xl"
                >
                    <RecordOptions
                        recordColor={recordColor}
                        setRecordColor={setRecordColor}
                        recordBgColor={recordBgColor}
                        setRecordBgColor={setRecordBgColor}
                        recordBgAlpha={recordBgAlpha}
                        setRecordBgAlpha={setRecordBgAlpha}
                        recordBgTransparent={recordBgTransparent}
                        setRecordBgTransparent={setRecordBgTransparent}
                    />
                </motion.div>
            )}

            {activeMenu === "text" &&
                selectedBox?.type === "text" &&
                texts.find((t) => t?.id=== selectedBox.id) && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="fixed inset-x-0 bottom-0 bg-white shadow-lg p-4 rounded-t-2xl"
                    >
                        <TextOptions
                            selectedBox={selectedBox}
                            texts={texts}
                            updateText={updateText}
                        />
                    </motion.div>
                )}
        </AnimatePresence>
    );
}
