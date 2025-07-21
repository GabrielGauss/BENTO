import * as React from "react";

interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isActive: boolean;
  isCollapsed?: boolean;
}

const SidebarButton = ({ icon: Icon, label, onClick, isActive, isCollapsed = false }: SidebarButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} h-10 text-sm font-medium rounded-lg transition-colors duration-200
      ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
    `}
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!isCollapsed && <span className="ml-3 truncate">{label}</span>}
  </button>
);

export default SidebarButton;