import { useEffect, useState, RefCallback } from "react";

// Hook to check if an element is visible on the screen
const useOnScreen = (): [boolean, RefCallback<HTMLElement>] => {
    const [isVisible, setIsVisible] = useState(false);
    const [element, setElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [element, isVisible]);

    return [isVisible, setElement];
};

export default useOnScreen;
