import NavItem from "./NavItem";
import NavItemSeparation from "./NavItemSeparation";

type Props = {
    onItemClick?: () => void;
};

function NavList({ onItemClick }: Props) {
    return (
        <>
            <NavItem to="/" label="nav.home" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="rooms" label="nav.rooms" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="racks" label="nav.racks" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="deviceTypes" label="nav.deviceTypes" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="devices" label="nav.devices" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="vms" label="nav.vms" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="services" label="nav.services" onClick={onItemClick}/>
            <NavItemSeparation />
            <NavItem to="customers" label="nav.customers" onClick={onItemClick}/>
        </>
    );
}

export default NavList;