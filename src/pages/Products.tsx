import { useState, useMemo } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useProducts, useAddProduct, useUpdateProduct, type Product, type NewProduct } from "@/hooks/useMongoDB";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Search,
  Loader2,
  Package,
  Plus,
  Pencil,
  Filter,
  X,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  Layers,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStockStatus(stock: number, reorderPoint: number) {
  if (stock === 0) {
    return { label: "Out of Stock", class: "bg-red-500/10 text-red-500" };
  }
  if (stock <= reorderPoint) {
    return { label: "Low Stock", class: "bg-amber-500/10 text-amber-500" };
  }
  return { label: "In Stock", class: "bg-emerald-500/10 text-emerald-500" };
}

const defaultNewProduct: NewProduct = {
  sku: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  reorderPoint: 10,
  imageUrl: undefined,
};

// Extended edit form type to include imageUrl
interface EditFormState {
  name: string;
  price: number;
  stock: number;
  category: string;
  reorderPoint: number;
  imageUrl?: string;
}

export default function Products() {
  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    reorderPoint: 0,
    imageUrl: undefined,
  });

  // Add form state
  const [addForm, setAddForm] = useState<NewProduct>(defaultNewProduct);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === "in-stock") {
        matchesStock = product.stock > product.reorderPoint;
      } else if (stockFilter === "low-stock") {
        matchesStock = product.stock <= product.reorderPoint && product.stock > 0;
      } else if (stockFilter === "out-of-stock") {
        matchesStock = product.stock === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const stockCounts = useMemo(() => {
    if (!products) return { all: 0, inStock: 0, lowStock: 0, outOfStock: 0 };

    return {
      all: products.length,
      inStock: products.filter((p) => p.stock > p.reorderPoint).length,
      lowStock: products.filter((p) => p.stock <= p.reorderPoint && p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
    };
  }, [products]);

  const totalStats = useMemo(() => {
    if (!products) return { totalValue: 0, totalSales: 0, totalRevenue: 0 };

    return {
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      totalSales: products.reduce((sum, p) => sum + p.sales, 0),
      totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
    };
  }, [products]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || stockFilter !== "all";

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      reorderPoint: product.reorderPoint,
      imageUrl: product.imageUrl,
    });
    setIsEditMode(true);
  };

  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    try {
      await updateProductMutation.mutateAsync({
        sku: selectedProduct.sku,
        ...editForm,
      });
      toast.success("Product updated successfully");
      closeModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const handleAddProduct = async () => {
    if (!addForm.sku || !addForm.name || !addForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addProductMutation.mutateAsync(addForm);
      toast.success("Product added successfully");
      setAddForm(defaultNewProduct);
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">
              Manage your inventory and product catalog
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products?.length || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold">{formatAmount(totalStats.totalValue)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{totalStats.totalSales.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-amber-500">{stockCounts.lowStock + stockCounts.outOfStock}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Layers className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Stock status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock ({stockCounts.all})</SelectItem>
                  <SelectItem value="in-stock">In Stock ({stockCounts.inStock})</SelectItem>
                  <SelectItem value="low-stock">Low Stock ({stockCounts.lowStock})</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock ({stockCounts.outOfStock})</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {hasActiveFilters
                ? `Filtered Products (${filteredProducts.length})`
                : "All Products"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>Failed to load products</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>No products found</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock, product.reorderPoint);
                      return (
                        <TableRow
                          key={product.sku}
                          className="group cursor-pointer"
                          onClick={() => openViewModal(product)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                {product.imageUrl ? (
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <span className="font-medium max-w-[200px] truncate">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {product.sku}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAmount(product.price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-medium",
                                  product.stock <= product.reorderPoint && "text-amber-500",
                                  product.stock === 0 && "text-red-500"
                                )}
                              >
                                {product.stock}
                              </span>
                              <Badge
                                variant="secondary"
                                className={cn(stockStatus.class, "border-0 text-xs")}
                              >
                                {stockStatus.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3 text-muted-foreground" />
                              <span>{product.sales}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-emerald-600">
                            {formatAmount(product.revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(product);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details/Edit Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {isEditMode ? "Edit Product" : "Product Details"}
              </DialogTitle>
              <DialogDescription>{selectedProduct?.sku}</DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {isEditMode ? (
                  <>
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <ImageUpload
                        value={editForm.imageUrl}
                        onChange={(url) =>
                          setEditForm((prev) => ({ ...prev, imageUrl: url }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price (₹)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              price: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-stock">Stock</Label>
                        <Input
                          id="edit-stock"
                          type="number"
                          value={editForm.stock}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              stock: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, category: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-reorder">Reorder Point</Label>
                        <Input
                          id="edit-reorder"
                          type="number"
                          value={editForm.reorderPoint}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              reorderPoint: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Product Image */}
                    {selectedProduct.imageUrl && (
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={selectedProduct.imageUrl} 
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-lg">{selectedProduct.name}</h4>
                      <Badge variant="outline" className="mt-2">
                        {selectedProduct.category}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-lg font-bold">
                          {formatAmount(selectedProduct.price)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">{selectedProduct.stock}</p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              getStockStatus(selectedProduct.stock, selectedProduct.reorderPoint)
                                .class,
                              "border-0 text-xs"
                            )}
                          >
                            {
                              getStockStatus(selectedProduct.stock, selectedProduct.reorderPoint)
                                .label
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-lg font-bold">
                          {selectedProduct.sales.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-lg font-bold text-emerald-600">
                          {formatAmount(selectedProduct.revenue)}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <p className="text-sm">
                          Reorder when stock falls below{" "}
                          <strong>{selectedProduct.reorderPoint}</strong> units
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter>
              {isEditMode ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={updateProductMutation.isPending}
                  >
                    {updateProductMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Product Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Product
              </DialogTitle>
              <DialogDescription>Add a new product to your inventory</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <ImageUpload
                  value={addForm.imageUrl}
                  onChange={(url) =>
                    setAddForm((prev) => ({ ...prev, imageUrl: url }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-name">Product Name *</Label>
                <Input
                  id="new-name"
                  placeholder="Enter product name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-sku">SKU *</Label>
                  <Input
                    id="new-sku"
                    placeholder="e.g., PROD-001"
                    value={addForm.sku}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, sku: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category">Category *</Label>
                  <Input
                    id="new-category"
                    placeholder="e.g., Laptops"
                    value={addForm.category}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-price">Price (₹)</Label>
                  <Input
                    id="new-price"
                    type="number"
                    placeholder="0"
                    value={addForm.price || ""}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, price: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-stock">Initial Stock</Label>
                  <Input
                    id="new-stock"
                    type="number"
                    placeholder="0"
                    value={addForm.stock || ""}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, stock: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-reorder">Reorder Point</Label>
                <Input
                  id="new-reorder"
                  type="number"
                  placeholder="10"
                  value={addForm.reorderPoint || ""}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      reorderPoint: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={addProductMutation.isPending}>
                {addProductMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
