import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { navMenuConfig } from "@/config/nav-menu";
import type { MenuItem } from "@/types";

export function MainNavigationMenu() {
  const about = navMenuConfig.aboutNav[0];
  const links = navMenuConfig.links;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* About Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>{about.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {/* Highlighted Section (if needed) */}
              <li className="row-span-3">
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/blog"
                >
                  <Icons.option className="size-8" />
                  <div className="mb-2 mt-3 text-lg font-medium">Blog</div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Learn more about Portcullis, our mission, and our community.
                  </p>
                </a>
              </li>

              {/* About Items */}
              {about.items?.map((item) => (
                <ListItem key={item.title} {...item} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Links Section */}
        {links.length > 0 && (
          <NavigationMenuItem>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={navigationMenuTriggerStyle()}
                {...(link.forceReload ? { "data-astro-reload": true } : {})}
              >
                {link.title}
              </a>
            ))}
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem: React.FC<MenuItem> = ({
  title,
  href,
  description,
  launched,
  disabled,
  external,
  forceReload,
}) => {
  const target = external ? "_blank" : undefined;

  return (
    <li>
      <a
        target={target}
        href={disabled ? undefined : href}
        {...(forceReload ? { "data-astro-reload": true } : {})}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          disabled
            ? "text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
            : ""
        )}
      >
        <div className="flex items-center text-sm font-medium leading-none">
          <span className="mr-2">{title}</span>
          {disabled ? (
            <Badge
              variant="secondary"
              radius="sm"
              className="h-5 px-1.5 text-xs font-medium"
            >
              SOON
            </Badge>
          ) : null}
          {launched ? (
            <Badge
              radius="sm"
              className="h-5 px-1.5 text-xs font-medium bg-[#ebf5ff] hover:bg-[#ebf5ff] text-[#0068d6]"
            >
              NEW
            </Badge>
          ) : null}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {description}
        </p>
      </a>
    </li>
  );
};
ListItem.displayName = "ListItem";
