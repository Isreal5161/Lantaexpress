import { useCallback, useEffect, useState } from "react";

export const useSessionModal = ({ storageKey, delay = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.sessionStorage.getItem(storageKey) === "true") return undefined;

    const openModal = () => {
      window.sessionStorage.setItem(storageKey, "true");
      setIsOpen(true);
    };

    if (delay > 0) {
      const timerId = window.setTimeout(openModal, delay);
      return () => window.clearTimeout(timerId);
    }

    openModal();
    return undefined;
  }, [delay, storageKey]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    closeModal,
    setIsOpen,
  };
};