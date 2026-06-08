import { useRef } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { toast } from "sonner";

type Props = {
  image: string | null;
  firstName?: string;
  lastName?: string;
  onChange: (dataUrl: string | null) => void;
};

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export function ProfileImageUploader({ image, firstName, lastName, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative">
        <ProfileAvatar image={image} firstName={firstName} lastName={lastName} size="xl" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground p-2 shadow-[var(--shadow-glow)] hover:bg-primary/90"
          aria-label="Change photo"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="border-border"
        >
          <Upload className="size-4 mr-2" />
          {image ? "Replace photo" : "Upload photo"}
        </Button>
        {image && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onChange(null);
              toast("Photo removed");
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-2" /> Remove photo
          </Button>
        )}
        <p className="text-xs text-muted-foreground">PNG or JPG, up to 2MB.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}