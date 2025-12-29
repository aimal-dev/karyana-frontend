
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Download, Upload, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface BulkOperationsProps {
  onSuccess?: () => void;
  type?: "products" | "categories";
}

export function BulkOperations({ onSuccess, type = "products" }: BulkOperationsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await api.get(`/bulk/${type}/export`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-export-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Export Successful",
        description: `Your ${type} have been exported successfully.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
            title: "Invalid File Type",
            description: "Please upload a CSV file.",
            variant: "destructive",
        });
        return;
    }

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/bulk/${type}/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Import Successful",
        description: response.data.message || `${type} imported successfully.`,
        variant: "success",
      });

      if (onSuccess) onSuccess();
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.response?.data?.details || error.response?.data?.error || "Failed to import data.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      
      <Button
        onClick={handleExport}
        disabled={isExporting || isImporting}
        variant="outline"
        className="h-10 px-4 bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2"
      >
        {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        <span className="hidden sm:inline">Export CSV</span>
      </Button>

      <Button
          onClick={() => {
            const headers = type === "products" 
              ? "Title,Description,Price,Stock,Image URL,Category,Featured,Trending,On Sale,Old Price,Tags"
              : "Name,Image";
            
            const sample = type === "products"
              ? "\nSample Product,Best quality item,100,50,https://example.com/image.jpg,Groceries,true,false,false,120,organic|fresh"
              : "\nFruits,https://example.com/fruit.jpg";

            const blob = new Blob([headers + sample], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}_template.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          variant="outline"
          className="h-10 px-4 bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20 gap-2"
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">Template</span>
        </Button>

      <Button
        onClick={handleImportClick}
        disabled={isExporting || isImporting}
        variant="outline"
        className="h-10 px-4 bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 gap-2"
      >
        {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        <span className="hidden sm:inline">Import CSV</span>
      </Button>
    </div>
  );
}
