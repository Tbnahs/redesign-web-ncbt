import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getFormErrors, newsletterSchema } from "@/lib/demo-validation";

interface NewsletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsletterDialog({ open, onOpenChange }: NewsletterDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEmail("");
      setError("");
      setSuccess(false);
    }
    onOpenChange(nextOpen);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(getFormErrors(result.error)["email"] ?? "Email chưa đúng định dạng.");
      setSuccess(false);
      return;
    }
    setEmail(result.data.email);
    setError("");
    setSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto border-border bg-background p-0 sm:max-w-md">
        <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold">Theo dõi tin mới</DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                Đăng ký minh họa, chưa gửi hoặc lưu email.
              </DialogDescription>
            </div>
          </div>
        </div>
        <form className="grid gap-4 p-5 sm:p-7" onSubmit={submit} noValidate>
          <label
            htmlFor="newsletter-email"
            className="grid gap-1.5 text-sm font-medium text-foreground"
          >
            Địa chỉ email
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setSuccess(false);
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "newsletter-email-error" : undefined}
              placeholder="ten@email.com"
              className="h-11 border-neutral-300 bg-background text-foreground placeholder:text-muted-foreground"
            />
            {error && (
              <span id="newsletter-email-error" className="text-xs text-destructive">
                {error}
              </span>
            )}
          </label>
          {success && (
            <p
              role="status"
              className="rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-800"
            >
              Đăng ký nhận tin thành công. Bạn sẽ nhận các thông tin mới nhất qua email.
            </p>
          )}
          <Button type="submit" className="h-11 w-full gap-2">
            <Mail className="size-4" aria-hidden="true" />
            Đăng ký nhận tin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
