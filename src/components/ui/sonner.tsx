import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:!border-success/40 group-[.toaster]:!bg-success/10 group-[.toaster]:!text-success [&_[data-icon]]:!text-success [&_[data-title]]:!text-success",
          error:
            "group-[.toaster]:!border-destructive/40 group-[.toaster]:!bg-destructive/10 group-[.toaster]:!text-destructive [&_[data-icon]]:!text-destructive [&_[data-title]]:!text-destructive",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
