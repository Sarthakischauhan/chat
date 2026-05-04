'use client';

import { ReactNode } from 'react';
import { MessageSquare, Plus, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useChat } from './chat.context';

type ChatShellProps = {
  children: ReactNode;
  composer: ReactNode;
};

function ChatSidebar() {
  const { activeThreadId, createThread, selectThread, threads } = useChat();

  return (
    <Sidebar
      collapsible="icon"
      className="group-data-[side=left]:border-r-0 group-data-[side=right]:border-l-0"
    >
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <div className="hidden justify-end md:flex">
            <SidebarTrigger />
          </div>
          <SidebarMenu className="w-full">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="New chat" onClick={() => void createThread()}>
                <Plus />
                <span>New chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.map((thread) => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton
                    isActive={thread.id === activeThreadId}
                    onClick={() => void selectThread(thread.id)}
                    tooltip={thread.title}
                  >
                    <MessageSquare />
                    <span>{thread.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function ChatShell({ children, composer }: ChatShellProps) {
  const { activeThreadId, threads } = useChat();
  const activeChat = threads.find((thread) => thread.id === activeThreadId)?.title ?? 'New chat';

  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="md:hidden" />
          <div className="font-medium">{activeChat}</div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 px-6 py-6 pb-8">
            <div className="mx-auto w-full max-w-3xl space-y-4">{children}</div>
          </div>
          <div className="sticky bottom-0 bg-background px-6 py-4">
            <div className="mx-auto w-full max-w-3xl">{composer}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
