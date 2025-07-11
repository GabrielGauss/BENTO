import { useState, useEffect, useRef } from 'react';

function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const ref = useRef<T>(null);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return [ref, value];
}

export default useHover;
import { useState, useEffect, useRef } from 'react';

function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const ref = useRef<T>(null);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return [ref, value];
}

export default useHover;