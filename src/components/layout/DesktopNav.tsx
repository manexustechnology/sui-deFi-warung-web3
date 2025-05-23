
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { QrCode } from 'lucide-react';

const DesktopNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={cn(
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/') && "bg-accent text-accent-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/products">
            <NavigationMenuLink
              className={cn(
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/products') && "bg-accent text-accent-foreground"
              )}
            >
              Products
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Only show for buyers */}
        {user && user.role === 'buyer' && (
          <NavigationMenuItem>
            <Link to="/payment/scan">
              <NavigationMenuLink
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  isActive('/payment/scan') && "bg-accent text-accent-foreground"
                )}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan Payment QR
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 w-[300px]">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">About the App</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Learn more about DeFi Warung WEB3 and its features</p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Contact Us</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Get in touch with our support team</p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">FAQ</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Frequently asked questions about our services</p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
