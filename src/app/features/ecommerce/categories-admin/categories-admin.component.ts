import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest
} from '../models/category.model';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './categories-admin.component.html',
  styleUrl: './categories-admin.component.scss'
})
export class CategoriesAdminComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');
  success = signal('');

  showForm = signal(false);
  editingCategoryId = signal<number | null>(null);

  formData: CategoryCreateRequest = {
    name: '',
    description: '',
    parentId: null
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set('');

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement catégories :', err);
        this.error.set('Impossible de charger les catégories.');
        this.loading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.editingCategoryId.set(null);
    this.formData = {
      name: '',
      description: '',
      parentId: null
    };
    this.error.set('');
    this.success.set('');
    this.showForm.set(true);
  }

  openEditForm(category: Category): void {
    this.editingCategoryId.set(category.id);
    this.formData = {
      name: category.name,
      description: category.description ?? '',
      parentId: category.parentId
    };
    this.error.set('');
    this.success.set('');
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingCategoryId.set(null);
    this.formData = {
      name: '',
      description: '',
      parentId: null
    };
    this.error.set('');
  }

  saveCategory(): void {
    this.error.set('');
    this.success.set('');

    const payload = {
      name: this.formData.name?.trim(),
      description: this.formData.description?.trim() || null,
      parentId: this.formData.parentId || null
    };

    if (!payload.name) {
      this.error.set('Le nom est obligatoire.');
      return;
    }

    const editingId = this.editingCategoryId();

    if (editingId !== null) {
      const updatePayload: CategoryUpdateRequest = {
        name: payload.name,
        description: payload.description,
        parentId: payload.parentId
      };

      this.categoryService.update(editingId, updatePayload).subscribe({
        next: () => {
          this.success.set('Catégorie modifiée avec succès.');
          this.showForm.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error('Erreur modification catégorie :', err);
          this.error.set(this.extractErrorMessage(err, 'Erreur lors de la modification de la catégorie.'));
        }
      });
    } else {
      const createPayload: CategoryCreateRequest = {
        name: payload.name,
        description: payload.description,
        parentId: payload.parentId
      };

      this.categoryService.create(createPayload).subscribe({
        next: () => {
          this.success.set('Catégorie ajoutée avec succès.');
          this.showForm.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error('Erreur création catégorie :', err);
          this.error.set(this.extractErrorMessage(err, 'Erreur lors de l’ajout de la catégorie.'));
        }
      });
    }
  }

  deleteCategory(id: number): void {
    const confirmed = confirm('Voulez-vous vraiment supprimer cette catégorie ?');
    if (!confirmed) return;

    this.error.set('');
    this.success.set('');

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.success.set('Catégorie supprimée avec succès.');
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erreur suppression catégorie :', err);
        this.error.set(this.extractErrorMessage(err, 'Erreur lors de la suppression de la catégorie.'));
      }
    });
  }

  getParentName(parentId: number | null): string {
    if (!parentId) return '-';
    const parent = this.categories().find(category => category.id === parentId);
    return parent ? parent.name : `#${parentId}`;
  }

  availableParents(currentCategoryId: number | null): Category[] {
    return this.categories().filter(category => category.id !== currentCategoryId);
  }

  private extractErrorMessage(err: any, fallback: string): string {
    if (err?.error?.message) return err.error.message;
    if (typeof err?.error === 'string') return err.error;
    return fallback;
  }
}