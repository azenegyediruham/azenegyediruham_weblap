export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_bootstrap_emails: {
        Row: {
          created_at: string
          email: string
          note: string | null
        }
        Insert: {
          created_at?: string
          email: string
          note?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          note?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          design_snapshot: Json | null
          id: string
          product_id: string
          quantity: number
          saved_design_id: string | null
          unit_price_huf: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          design_snapshot?: Json | null
          id?: string
          product_id: string
          quantity?: number
          saved_design_id?: string | null
          unit_price_huf: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          design_snapshot?: Json | null
          id?: string
          product_id?: string
          quantity?: number
          saved_design_id?: string | null
          unit_price_huf?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_saved_design_id_fkey"
            columns: ["saved_design_id"]
            isOneToOne: false
            referencedRelation: "saved_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          image_path: string | null
          is_active: boolean
          name: string
          silhouette: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          name: string
          silhouette?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          name?: string
          silhouette?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      colors: {
        Row: {
          hex: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          hex: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          hex?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      creator_applications: {
        Row: {
          admin_notes: string | null
          content_idea: string
          created_at: string
          email: string
          follower_count: number
          id: string
          name: string
          notes: string | null
          platform: string
          post_plan: string
          profile_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          screenshot_path: string | null
          social_username: string
          status: Database["public"]["Enums"]["creator_application_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          content_idea?: string
          created_at?: string
          email: string
          follower_count?: number
          id?: string
          name: string
          notes?: string | null
          platform: string
          post_plan?: string
          profile_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_path?: string | null
          social_username: string
          status?: Database["public"]["Enums"]["creator_application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          content_idea?: string
          created_at?: string
          email?: string
          follower_count?: number
          id?: string
          name?: string
          notes?: string | null
          platform?: string
          post_plan?: string
          profile_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_path?: string | null
          social_username?: string
          status?: Database["public"]["Enums"]["creator_application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customization_zones: {
        Row: {
          display_name: string
          garment_model_id: string
          id: string
          is_active: boolean
          key: string
          mapping_3d: Json | null
          max_height_cm: number
          max_width_cm: number
          min_width_cm: number
          rect_h: number
          rect_w: number
          rect_x: number
          rect_y: number
          sort_order: number
          view_key: Database["public"]["Enums"]["garment_view"]
        }
        Insert: {
          display_name: string
          garment_model_id: string
          id?: string
          is_active?: boolean
          key: string
          mapping_3d?: Json | null
          max_height_cm: number
          max_width_cm: number
          min_width_cm?: number
          rect_h: number
          rect_w: number
          rect_x: number
          rect_y: number
          sort_order?: number
          view_key?: Database["public"]["Enums"]["garment_view"]
        }
        Update: {
          display_name?: string
          garment_model_id?: string
          id?: string
          is_active?: boolean
          key?: string
          mapping_3d?: Json | null
          max_height_cm?: number
          max_width_cm?: number
          min_width_cm?: number
          rect_h?: number
          rect_w?: number
          rect_x?: number
          rect_y?: number
          sort_order?: number
          view_key?: Database["public"]["Enums"]["garment_view"]
        }
        Relationships: [
          {
            foreignKeyName: "customization_zones_garment_model_id_fkey"
            columns: ["garment_model_id"]
            isOneToOne: false
            referencedRelation: "garment_models"
            referencedColumns: ["id"]
          },
        ]
      }
      design_assets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          storage_path: string
          tags: string[]
          thumbnail_path: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          storage_path: string
          tags?: string[]
          thumbnail_path?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          storage_path?: string
          tags?: string[]
          thumbnail_path?: string | null
        }
        Relationships: []
      }
      design_likes: {
        Row: {
          created_at: string
          saved_design_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          saved_design_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          saved_design_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_likes_saved_design_id_fkey"
            columns: ["saved_design_id"]
            isOneToOne: false
            referencedRelation: "saved_designs"
            referencedColumns: ["id"]
          },
        ]
      }
      fits: {
        Row: {
          description: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          color_id: string | null
          created_at: string
          description: string
          design_asset_id: string | null
          height_cm: number | null
          id: string
          image_path: string | null
          is_published: boolean
          likes_count: number
          product_id: string | null
          saved_design_id: string | null
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
          width_cm: number | null
          zone_key: string | null
        }
        Insert: {
          color_id?: string | null
          created_at?: string
          description?: string
          design_asset_id?: string | null
          height_cm?: number | null
          id?: string
          image_path?: string | null
          is_published?: boolean
          likes_count?: number
          product_id?: string | null
          saved_design_id?: string | null
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
          width_cm?: number | null
          zone_key?: string | null
        }
        Update: {
          color_id?: string | null
          created_at?: string
          description?: string
          design_asset_id?: string | null
          height_cm?: number | null
          id?: string
          image_path?: string | null
          is_published?: boolean
          likes_count?: number
          product_id?: string | null
          saved_design_id?: string | null
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
          width_cm?: number | null
          zone_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_design_asset_id_fkey"
            columns: ["design_asset_id"]
            isOneToOne: false
            referencedRelation: "design_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_saved_design_id_fkey"
            columns: ["saved_design_id"]
            isOneToOne: false
            referencedRelation: "saved_designs"
            referencedColumns: ["id"]
          },
        ]
      }
      garment_models: {
        Row: {
          charts: Json
          created_at: string
          id: string
          is_active: boolean
          mapping_mode: Database["public"]["Enums"]["mapping_mode"]
          model_path: string | null
          name: string
          preview_image_path: string | null
          scale: number
          silhouette: string
          slug: string
          updated_at: string
          views: Json
        }
        Insert: {
          charts?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          mapping_mode?: Database["public"]["Enums"]["mapping_mode"]
          model_path?: string | null
          name: string
          preview_image_path?: string | null
          scale?: number
          silhouette?: string
          slug: string
          updated_at?: string
          views?: Json
        }
        Update: {
          charts?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          mapping_mode?: Database["public"]["Enums"]["mapping_mode"]
          model_path?: string | null
          name?: string
          preview_image_path?: string | null
          scale?: number
          silhouette?: string
          slug?: string
          updated_at?: string
          views?: Json
        }
        Relationships: []
      }
      order_item_embroidery_files: {
        Row: {
          created_at: string
          digitized_path: string | null
          embroidery_machine_format: string | null
          id: string
          notes: string | null
          order_item_id: string
          original_source_path: string | null
          physical_height_cm: number | null
          physical_width_cm: number | null
          preview_path: string | null
          status: Database["public"]["Enums"]["embroidery_file_status"]
          stitch_count: number | null
          thread_colors: Json
          updated_at: string
          zone_key: string
        }
        Insert: {
          created_at?: string
          digitized_path?: string | null
          embroidery_machine_format?: string | null
          id?: string
          notes?: string | null
          order_item_id: string
          original_source_path?: string | null
          physical_height_cm?: number | null
          physical_width_cm?: number | null
          preview_path?: string | null
          status?: Database["public"]["Enums"]["embroidery_file_status"]
          stitch_count?: number | null
          thread_colors?: Json
          updated_at?: string
          zone_key: string
        }
        Update: {
          created_at?: string
          digitized_path?: string | null
          embroidery_machine_format?: string | null
          id?: string
          notes?: string | null
          order_item_id?: string
          original_source_path?: string | null
          physical_height_cm?: number | null
          physical_width_cm?: number | null
          preview_path?: string | null
          status?: Database["public"]["Enums"]["embroidery_file_status"]
          stitch_count?: number | null
          thread_colors?: Json
          updated_at?: string
          zone_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_embroidery_files_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          design_snapshot: Json | null
          id: string
          line_total_huf: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          saved_design_id: string | null
          unit_price_huf: number
          variant_id: string | null
          variant_snapshot: Json
        }
        Insert: {
          created_at?: string
          design_snapshot?: Json | null
          id?: string
          line_total_huf: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          saved_design_id?: string | null
          unit_price_huf: number
          variant_id?: string | null
          variant_snapshot?: Json
        }
        Update: {
          created_at?: string
          design_snapshot?: Json | null
          id?: string
          line_total_huf?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          saved_design_id?: string | null
          unit_price_huf?: number
          variant_id?: string | null
          variant_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_saved_design_id_fkey"
            columns: ["saved_design_id"]
            isOneToOne: false
            referencedRelation: "saved_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          created_at: string
          currency: string
          customer_name: string
          discount_huf: number
          email: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string | null
          placed_at: string
          shipping_address: Json
          shipping_fee_huf: number
          shipping_method: string
          shipping_reference: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_huf: number
          total_huf: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_name: string
          discount_huf?: number
          email: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          placed_at?: string
          shipping_address?: Json
          shipping_fee_huf?: number
          shipping_method?: string
          shipping_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_huf?: number
          total_huf?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_name?: string
          discount_huf?: number
          email?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          placed_at?: string
          shipping_address?: Json
          shipping_fee_huf?: number
          shipping_method?: string
          shipping_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_huf?: number
          total_huf?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string
          color_id: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["product_image_kind"]
          product_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt?: string
          color_id?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["product_image_kind"]
          product_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt?: string
          color_id?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["product_image_kind"]
          product_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_id: string
          created_at: string
          fit_id: string
          id: string
          is_active: boolean
          price_override_huf: number | null
          product_id: string
          size_id: string
          sku: string
          stock_qty: number
          updated_at: string
        }
        Insert: {
          color_id: string
          created_at?: string
          fit_id: string
          id?: string
          is_active?: boolean
          price_override_huf?: number | null
          product_id: string
          size_id: string
          sku: string
          stock_qty?: number
          updated_at?: string
        }
        Update: {
          color_id?: string
          created_at?: string
          fit_id?: string
          id?: string
          is_active?: boolean
          price_override_huf?: number | null
          product_id?: string
          size_id?: string
          sku?: string
          stock_qty?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_fit_id_fkey"
            columns: ["fit_id"]
            isOneToOne: false
            referencedRelation: "fits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price_huf: number
          category_id: string
          created_at: string
          currency: string
          description: string
          garment_model_id: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          is_active: boolean
          is_customizable: boolean
          is_featured: boolean
          name: string
          seo_description: string | null
          seo_title: string | null
          silhouette: string
          size_chart_id: string | null
          slug: string
          sort_order: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          base_price_huf: number
          category_id: string
          created_at?: string
          currency?: string
          description?: string
          garment_model_id?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_active?: boolean
          is_customizable?: boolean
          is_featured?: boolean
          name: string
          seo_description?: string | null
          seo_title?: string | null
          silhouette?: string
          size_chart_id?: string | null
          slug: string
          sort_order?: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          base_price_huf?: number
          category_id?: string
          created_at?: string
          currency?: string
          description?: string
          garment_model_id?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_active?: boolean
          is_customizable?: boolean
          is_featured?: boolean
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          silhouette?: string
          size_chart_id?: string | null
          slug?: string
          sort_order?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_garment_model_id_fkey"
            columns: ["garment_model_id"]
            isOneToOne: false
            referencedRelation: "garment_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_size_chart_id_fkey"
            columns: ["size_chart_id"]
            isOneToOne: false
            referencedRelation: "size_charts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      saved_design_items: {
        Row: {
          created_at: string
          design_asset_id: string | null
          embroidery: Json
          height_cm: number
          id: string
          rotation_deg: number
          saved_design_id: string
          scale: number
          sort_order: number
          source_type: Database["public"]["Enums"]["design_item_source"]
          user_upload_id: string | null
          width_cm: number
          x_cm: number
          y_cm: number
          zone_id: string | null
          zone_key: string
        }
        Insert: {
          created_at?: string
          design_asset_id?: string | null
          embroidery?: Json
          height_cm: number
          id?: string
          rotation_deg?: number
          saved_design_id: string
          scale?: number
          sort_order?: number
          source_type: Database["public"]["Enums"]["design_item_source"]
          user_upload_id?: string | null
          width_cm: number
          x_cm?: number
          y_cm?: number
          zone_id?: string | null
          zone_key: string
        }
        Update: {
          created_at?: string
          design_asset_id?: string | null
          embroidery?: Json
          height_cm?: number
          id?: string
          rotation_deg?: number
          saved_design_id?: string
          scale?: number
          sort_order?: number
          source_type?: Database["public"]["Enums"]["design_item_source"]
          user_upload_id?: string | null
          width_cm?: number
          x_cm?: number
          y_cm?: number
          zone_id?: string | null
          zone_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_design_items_design_asset_id_fkey"
            columns: ["design_asset_id"]
            isOneToOne: false
            referencedRelation: "design_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_design_items_saved_design_id_fkey"
            columns: ["saved_design_id"]
            isOneToOne: false
            referencedRelation: "saved_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_design_items_user_upload_id_fkey"
            columns: ["user_upload_id"]
            isOneToOne: false
            referencedRelation: "user_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_design_items_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "customization_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_designs: {
        Row: {
          color_id: string | null
          config: Json
          created_at: string
          fit_id: string | null
          id: string
          is_public: boolean
          likes_count: number
          name: string
          preview_path: string | null
          product_id: string | null
          public_code: string
          size_id: string | null
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          color_id?: string | null
          config?: Json
          created_at?: string
          fit_id?: string | null
          id?: string
          is_public?: boolean
          likes_count?: number
          name?: string
          preview_path?: string | null
          product_id?: string | null
          public_code?: string
          size_id?: string | null
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          color_id?: string | null
          config?: Json
          created_at?: string
          fit_id?: string | null
          id?: string
          is_public?: boolean
          likes_count?: number
          name?: string
          preview_path?: string | null
          product_id?: string | null
          public_code?: string
          size_id?: string | null
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_designs_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_designs_fit_id_fkey"
            columns: ["fit_id"]
            isOneToOne: false
            referencedRelation: "fits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_designs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_designs_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_designs_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      size_chart_entries: {
        Row: {
          id: string
          measurements: Json
          size_chart_id: string
          size_id: string
        }
        Insert: {
          id?: string
          measurements?: Json
          size_chart_id: string
          size_id: string
        }
        Update: {
          id?: string
          measurements?: Json
          size_chart_id?: string
          size_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "size_chart_entries_size_chart_id_fkey"
            columns: ["size_chart_id"]
            isOneToOne: false
            referencedRelation: "size_charts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "size_chart_entries_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      size_charts: {
        Row: {
          created_at: string
          id: string
          measurement_keys: string[]
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          measurement_keys?: string[]
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          measurement_keys?: string[]
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      sizes: {
        Row: {
          code: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          height_px: number | null
          id: string
          is_vector: boolean
          mime_type: string | null
          original_filename: string | null
          preview_path: string | null
          sanitized: boolean
          size_bytes: number | null
          storage_path: string
          user_id: string
          width_px: number | null
        }
        Insert: {
          bucket_id?: string
          created_at?: string
          height_px?: number | null
          id?: string
          is_vector?: boolean
          mime_type?: string | null
          original_filename?: string | null
          preview_path?: string | null
          sanitized?: boolean
          size_bytes?: number | null
          storage_path: string
          user_id: string
          width_px?: number | null
        }
        Update: {
          bucket_id?: string
          created_at?: string
          height_px?: number | null
          id?: string
          is_vector?: boolean
          mime_type?: string | null
          original_filename?: string | null
          preview_path?: string | null
          sanitized?: boolean
          size_bytes?: number | null
          storage_path?: string
          user_id?: string
          width_px?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_design_code: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      seed_uuid: { Args: { key: string }; Returns: string }
    }
    Enums: {
      creator_application_status:
        | "submitted"
        | "reviewing"
        | "approved"
        | "rejected"
        | "fulfilled"
      design_item_source: "upload" | "asset"
      embroidery_file_status: "pending" | "digitizing" | "ready" | "rejected"
      garment_view: "front" | "back" | "left_sleeve" | "right_sleeve"
      gender_type: "women" | "men" | "unisex"
      mapping_mode: "uv" | "decal"
      order_status:
        | "pending"
        | "confirmed"
        | "in_production"
        | "ready"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_status: "unpaid" | "pending" | "paid" | "refunded" | "failed"
      product_image_kind:
        | "gallery"
        | "thumbnail"
        | "template_front"
        | "template_back"
      user_role: "customer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      creator_application_status: [
        "submitted",
        "reviewing",
        "approved",
        "rejected",
        "fulfilled",
      ],
      design_item_source: ["upload", "asset"],
      embroidery_file_status: ["pending", "digitizing", "ready", "rejected"],
      garment_view: ["front", "back", "left_sleeve", "right_sleeve"],
      gender_type: ["women", "men", "unisex"],
      mapping_mode: ["uv", "decal"],
      order_status: [
        "pending",
        "confirmed",
        "in_production",
        "ready",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: ["unpaid", "pending", "paid", "refunded", "failed"],
      product_image_kind: [
        "gallery",
        "thumbnail",
        "template_front",
        "template_back",
      ],
      user_role: ["customer", "admin"],
    },
  },
} as const

