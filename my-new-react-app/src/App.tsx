import React from 'react';
import BentoPage from './pages/BentoPage';
import { PenTool, Image, Music, Video, Link as LinkIcon, Brush, Youtube } from 'lucide-react';
import useFabMenuState from './hooks/useFabMenuState';
import Fab, { type FABItem } from './components/ui/Fab';
import './index.css';
import './global.css';

const FAB_ITEMS: FABItem[] = [
  { icon: PenTool, label: 'Text', type: 'text' },
  { icon: Image, label: 'Image', type: 'image' },
  { icon: Music, label: 'Audio', type: 'audio' },
  { icon: Video, label: 'Video', type: 'video' },
  { icon: LinkIcon, label: 'Link', type: 'link' },
  { icon: Brush, label: 'Drawing', type: 'drawing' },
  { icon: Youtube, label: 'YouTube', type: 'youtube' },
];

const App: React.FC = () => {
  const { fabOpen, toggleFabMenu } = useFabMenuState();
  const handleCreateBento = (item: FABItem) => {
    // Placeholder: connect to modal or creation logic
    alert(`Create new: ${item.label}`);
  };

  return (
    <>
      <BentoPage />
      <Fab
        fabOpen={fabOpen}
        toggleFabMenu={toggleFabMenu}
        handleCreateBento={handleCreateBento}
        fabItems={FAB_ITEMS}
      />
    </>
  );
};

export default App;