import styles from "@/styles/Modal.module.css";
import { useEffect, useState } from "react";
import UserPreferences from "@/utils/UserPreferences";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const EMOJIES_TOPICS = {
  art: "🎨",
  business: "💼",
  computers: "💻",
  games: "🎮",
  health: "🏥",
  home: "🏠",
  news: "📰",
  recreation: "🎭",
  reference: "📚",
  regional: "🌎",
  science: "🔬",
  shopping: "🛒",
  society: "👥",
  sports: "⚽",
  "kids and teens": "👶",
  world: "🌍",
};

const SettingsModal = ({ show, setShow }) => {
  const [modalOpen, setModalOpen] = useState(styles.modalClose);
  const [selectedTopics, setSelectedTopics] = useState({});
  const userPreferences = new UserPreferences();

  useEffect(() => {
    setSelectedTopics(userPreferences.getTopicsPreferences());
  }, []);

  useEffect(() => {
    if (show) {
      setModalOpen(styles.modalOpen);
    } else {
      setModalOpen(styles.modalClose);
    }
  }, [show]);

  return (
    <>
      <div
        className={`${styles.modalOverlay} ${modalOpen} ${inter.className}`}
        id="settingsModal"
        tabIndex="-1"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
      >
        <div className={styles.modalDialog}>
          <h3 className="modal-title" id="settingsModalLabel">
            User Preferences
          </h3>
          <section className={styles.modalBody}>
            {Object.entries(selectedTopics).map(([key, value]) => (
              <label className={styles.card} key={key} htmlFor={key}>
                <input
                  className={styles.formCheckInput}
                  type="checkbox"
                  value={key}
                  id={key}
                  checked={value}
                  onChange={(e) => {
                    let selected = { ...selectedTopics };
                    selected[key] = e.target.checked ? 1 : 0;
                    setSelectedTopics(selected);
                  }}
                />
                <label className={styles.formCheckLabel} htmlFor={key}>
                  {key[0].toUpperCase() + key.slice(1)} {EMOJIES_TOPICS[key]}
                </label>
              </label>
            ))}
          </section>
          <button
            type="button"
            className={styles.btnSave}
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShow(false);
              userPreferences.setTopicsPreferences(selectedTopics);
            }}
          >
            Save
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShow(false);
              setSelectedTopics(userPreferences.getTopicsPreferences());
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
