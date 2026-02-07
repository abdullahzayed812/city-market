import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image as ImageIcon } from "lucide-react";

interface ProductImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  productName: string;
}

const ProductImageModal = ({ isOpen, onClose, imageUrl, productName }: ProductImageModalProps) => {
  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    return url.startsWith("/") ? `${import.meta.env.VITE_API_BASE_URL}${url}` : url;
  };

  const fullImageUrl = getFullImageUrl(imageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{productName}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {fullImageUrl ? (
            <div className="relative w-full max-h-[500px] overflow-hidden rounded-lg bg-muted">
              <img
                src={fullImageUrl}
                alt={productName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden flex items-center justify-center h-64">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Failed to load image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 w-full bg-muted rounded-lg">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No image available</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageModal;
