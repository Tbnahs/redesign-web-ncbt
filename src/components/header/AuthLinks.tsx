import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { AccountDialog } from '@/components/header/AccountDialog';
import { Button } from '@/components/ui/button';

export function AuthLinks({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'register'>('login');

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => { setInitialTab('login'); setOpen(true); }}
        className={`h-10 gap-2 px-2 text-sm font-bold ${className}`}
      >
        <UserRound className="size-4" aria-hidden="true" />
        <span>ĐĂNG NHẬP / ĐĂNG KÍ</span>
      </Button>
      <AccountDialog open={open} onOpenChange={setOpen} initialTab={initialTab} />
    </>
  );
}
