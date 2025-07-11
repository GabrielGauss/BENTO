import React from "react";
import { cn } from "@/utils/cn";
import { type ClassValue } from "clsx"; // Assuming ClassValue is needed for cn
import { ButtonComponent } from "@/components/ui/Button"; // Assuming ButtonComponent is exported


interface SidebarButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    isCollapsed?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
    icon: Icon,
    label,
    onClick,
    isActive,
    isCollapsed
}) => (
    <ButtonComponent
        variant="ghost"
        onClick={onClick}
        className={cn(
            "w-full text-sm font-medium transition-all duration-200",
            "text-gray-300 hover:text-white hover:bg-gray-700",
            isActive && "bg-gray-700 text-white",
            isCollapsed ? "justify-center px-0 h-10" : "justify-start px-3 h-9"
        )}
        title={isCollapsed ? label : undefined}
    >
        <Icon className={cn("w-4 h-4 flex-shrink-0", !isCollapsed && "mr-2")} />
        {!isCollapsed && <span className="truncate">{label}</span>}
    </ButtonComponent>
);

export default SidebarButton;
import React from "react";
import { cn } from "@/utils/cn";
import { type ClassValue } from "clsx"; // Assuming ClassValue is needed for cn
import { ButtonComponent } from "@/components/ui/Button"; // Assuming ButtonComponent is exported


interface SidebarButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    isCollapsed?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
    icon: Icon,
    label,
    onClick,
    isActive,
    isCollapsed
}) => (
    <ButtonComponent
        variant="ghost"
        onClick={onClick}
        className={cn(
            "w-full text-sm font-medium transition-all duration-200",
            "text-gray-300 hover:text-white hover:bg-gray-700",
            isActive && "bg-gray-700 text-white",
            isCollapsed ? "justify-center px-0 h-10" : "justify-start px-3 h-9"
        )}
        title={isCollapsed ? label : undefined}
    >
        <Icon className={cn("w-4 h-4 flex-shrink-0", !isCollapsed && "mr-2")} />
        {!isCollapsed && <span className="truncate">{label}</span>}
    </ButtonComponent>
);

export default SidebarButton;