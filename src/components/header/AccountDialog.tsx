import { useState, type FormEvent } from "react";
import { verifyDemoAdmin, signInDemoAdmin } from "@/lib/demo-auth";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFormErrors, signInSchema, signUpSchema } from "@/lib/demo-validation";

type AccountTab = "login" | "register";
type FormValues = Record<string, string>;

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: AccountTab;
}

const inputClass =
  "h-11 border-neutral-300 bg-background text-foreground placeholder:text-muted-foreground";

export function AccountDialog({ open, onOpenChange, initialTab = "login" }: AccountDialogProps) {
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const reset = () => {
    setValues({});
    setErrors({});
    setShowPassword(false);
    setSuccess("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const updateValue = (field: string, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setSuccess("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result =
      tab === "login"
        ? signInSchema.safeParse({
            email: values["email"] ?? "",
            password: values["password"] ?? "",
          })
        : signUpSchema.safeParse({
            fullName: values["fullName"] ?? "",
            email: values["email"] ?? "",
            password: values["password"] ?? "",
            confirmPassword: values["confirmPassword"] ?? "",
          });

    if (!result.success) {
      setErrors(getFormErrors(result.error));
      setSuccess("");
      return;
    }

    if (tab === "login") {
      if (await verifyDemoAdmin(values["email"] ?? "", values["password"] ?? "")) {
        signInDemoAdmin();
        handleOpenChange(false);
        window.location.assign("/admin");
        return;
      }
      setErrors({
        password:
          "Tài khoản hoặc mật khẩu chưa đúng. Tài khoản Admin demo: admin@ncbt.demo / demo123 (hoặc mật khẩu demo bạn đã đổi).",
      });
      setSuccess("");
      return;
    }
    setErrors({});
    setSuccess("Đăng ký minh họa thành công. Thông tin chưa được lưu.");
  };

  const renderField = (
    field: string,
    label: string,
    type: string,
    placeholder: string,
    autoComplete: string,
  ) => (
    <label
      className="grid gap-1.5 text-sm font-medium text-foreground"
      htmlFor={`account-${field}`}
    >
      {label}
      <Input
        id={`account-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        maxLength={field === "email" ? 254 : field === "fullName" ? 100 : 100}
        required
        value={values[field] ?? ""}
        onChange={(event) => updateValue(field, event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[field])}
        aria-describedby={errors[field] ? `account-${field}-error` : undefined}
        className={inputClass}
      />
      {errors[field] && (
        <span id={`account-${field}-error`} className="text-xs text-destructive">
          {errors[field]}
        </span>
      )}
    </label>
  );

  const passwordField = (
    field: "password" | "confirmPassword",
    label: string,
    autoComplete: string,
  ) => (
    <label
      className="grid gap-1.5 text-sm font-medium text-foreground"
      htmlFor={`account-${field}`}
    >
      {label}
      <span className="relative block">
        <Input
          id={`account-${field}`}
          name={field}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={6}
          maxLength={100}
          required
          value={values[field] ?? ""}
          onChange={(event) => updateValue(field, event.target.value)}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `account-${field}-error` : undefined}
          className={`${inputClass} pr-12`}
        />
        {field === "password" && (
          <button
            type="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-1 inline-flex w-10 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </span>
      {errors[field] && (
        <span id={`account-${field}-error`} className="text-xs text-destructive">
          {errors[field]}
        </span>
      )}
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto border-border bg-background p-0 sm:max-w-md">
        <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold">Tài khoản</DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                Admin demo: admin@ncbt.demo · mật khẩu demo123.
              </DialogDescription>
            </div>
          </div>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as AccountTab);
            reset();
          }}
          className="px-5 pb-6 pt-5 sm:px-7"
        >
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-md bg-muted">
            <TabsTrigger value="login" className="rounded-sm">
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-sm">
              Đăng kí
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-5">
            <form className="grid gap-4" onSubmit={submit} noValidate>
              {renderField("email", "Email", "email", "ten@email.com", "email")}
              {passwordField("password", "Mật khẩu", "current-password")}
              {success && (
                <p
                  role="status"
                  className="rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-800"
                >
                  {success}
                </p>
              )}
              <Button type="submit" className="h-11 w-full gap-2">
                <LockKeyhole className="size-4" aria-hidden="true" />
                Đăng nhập
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="mt-5">
            <form className="grid gap-4" onSubmit={submit} noValidate>
              {renderField("fullName", "Họ và tên", "text", "Nguyễn Văn A", "name")}
              {renderField("email", "Email", "email", "ten@email.com", "email")}
              {passwordField("password", "Mật khẩu", "new-password")}
              {passwordField("confirmPassword", "Nhập lại mật khẩu", "new-password")}
              {success && (
                <p
                  role="status"
                  className="rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-800"
                >
                  {success}
                </p>
              )}
              <Button type="submit" className="h-11 w-full gap-2">
                <UserRound className="size-4" aria-hidden="true" />
                Tạo tài khoản
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
