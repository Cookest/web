"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button, Input, Textarea, Select, Label, Card, CardBody, Spinner, Toast, useToast } from "@cookest/ui";
import { api } from "@/lib/api";
import { CUISINES, DIFFICULTIES } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";

export default function CreateRecipePage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([{ instruction: "" }]);

  const createMutation = useMutation({
    mutationFn: async () => {
      // 1. Create the recipe
      const recipeData: any = {
        name,
        description,
        cuisine,
        category: cuisine, // fallback for backend
        difficulty,
        prep_time_min: parseInt(prepTime) || 0,
        cook_time_min: parseInt(cookTime) || 0,
        total_time_min: (parseInt(prepTime) || 0) + (parseInt(cookTime) || 0),
        servings: parseInt(servings) || 2,
        ingredients: ingredients.filter(i => i.name.trim() !== "").map(i => ({
          ingredient_name: i.name,
          quantity: parseFloat(i.quantity) || null,
          unit: i.unit || null,
        })),
        steps: steps.filter(s => s.instruction.trim() !== "").map((s, idx) => ({
          step_number: idx + 1,
          instruction: s.instruction,
        })),
      };

      const newRecipe = await api.createRecipe(recipeData);

      // 2. Upload image if provided
      if (imageFile && newRecipe.id) {
        await api.uploadRecipeImage(newRecipe.id, imageFile);
      }

      return newRecipe;
    },
    onSuccess: (data) => {
      toast({
        title: "Recipe created!",
        description: "Your recipe has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push(`/recipes/${data.id}`);
    },
    onError: (err: any) => {
      if (err.message?.includes("Pro")) {
        router.push("/pricing");
      } else {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create recipe",
        });
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngs = [...ingredients];
    newIngs[index] = { ...newIngs[index], [field]: value };
    setIngredients(newIngs);
  };
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => setSteps([...steps, { instruction: "" }]);
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].instruction = value;
    setSteps(newSteps);
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Validation Error", description: "Recipe name is required" });
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" className="h-10 w-10 p-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Create a Recipe" subtitle="Share your culinary masterpiece with the community." />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardBody className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Recipe Image</Label>
              <div 
                className="relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--ck-border)] bg-[var(--ck-bg-secondary)] transition-colors hover:bg-[var(--ck-bg-card)] overflow-hidden"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--ck-text-muted)]">
                    <Upload className="h-8 w-8" />
                    <span>Click to upload an image</span>
                    <span className="text-xs">JPG, PNG up to 10MB</span>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Recipe Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Nonna's Spicy Meatballs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A short description of what makes this recipe special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine</Label>
                <Select
                  options={[
                    { label: "Select Cuisine", value: "" },
                    ...CUISINES.map((c) => ({ label: c, value: c }))
                  ]}
                  value={cuisine}
                  onChange={setCuisine}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  options={DIFFICULTIES.map((d) => ({ label: d, value: d }))}
                  value={difficulty}
                  onChange={setDifficulty}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (mins)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (mins)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Ingredients</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addIngredient}>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Qty"
                    className="w-20"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                  />
                  <Input
                    placeholder="Unit"
                    className="w-24"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                  />
                  <Input
                    placeholder="Ingredient name"
                    className="flex-1"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1} className="h-10 w-10 p-0 shrink-0">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Instructions</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addStep}>
                <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--ck-bg-secondary)] font-medium">
                    {idx + 1}
                  </div>
                  <Textarea
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="flex-1"
                    rows={2}
                    value={step.instruction}
                    onChange={(e) => updateStep(idx, e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={() => removeStep(idx)} disabled={steps.length === 1} className="h-10 w-10 p-0 shrink-0">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending} className="bg-[#7a9a65] hover:bg-[#6b8a56]">
            {createMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
            Publish Recipe
          </Button>
        </div>
      </form>
    </div>
  );
}
