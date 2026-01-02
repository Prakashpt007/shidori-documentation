import { Component } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-database',
  imports: [Highlight],
  templateUrl: './database.html',
  styleUrl: './database.scss',
})
export class Database {
  user_table = `CREATE TABLE IF NOT EXISTS users (
  id                      BIGINT PRIMARY KEY AUTO_INCREMENT,
  name                    VARCHAR(150) NOT NULL COMMENT 'Customer full name',
  email                   VARCHAR(150) UNIQUE COMMENT 'Unique email; nullable for phone-only accounts',
  phone                   VARCHAR(20) UNIQUE NOT NULL COMMENT 'Unique phone; primary contact',
  password_hash           VARCHAR(300) COMMENT 'Hashed password; nullable for OTP-only accounts',
  dob                     DATE COMMENT 'Date of birth',
  status                  ENUM('active','inactive','deleted') NOT NULL DEFAULT 'active' COMMENT 'Account status',
  has_updated_password    BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag if user has updated temporary password',
  is_first_login          BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Flag to track first-time login for onboarding',
  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_phone (phone),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer user accounts';
`;


  user_addresses_table = `CREATE TABLE IF NOT EXISTS user_addresses (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT NOT NULL COMMENT 'FK to users',
  name        VARCHAR(100) NOT NULL COMMENT 'Address label (Home, Office, etc.)',
  phone       VARCHAR(20) NOT NULL COMMENT 'Contact phone for this address',
  city        VARCHAR(100) NOT NULL COMMENT 'City',
  state       VARCHAR(100) NOT NULL COMMENT 'State',
  pincode     VARCHAR(6) NOT NULL COMMENT 'Postal code',
  full_address TEXT NOT NULL COMMENT 'Complete address',
  is_default  BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Default delivery address',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multiple delivery addresses per customer';
`;


  user_locations = `CREATE TABLE IF NOT EXISTS user_locations (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id           BIGINT NOT NULL COMMENT 'FK to users',
  latitude          DECIMAL(10,8) NOT NULL COMMENT 'GPS latitude',
  longitude         DECIMAL(11,8) NOT NULL COMMENT 'GPS longitude',
  address_string    VARCHAR(500) COMMENT 'Readable address from GPS',
  detection_method  ENUM('auto','manual') NOT NULL DEFAULT 'auto' COMMENT 'Auto via browser or manual entry',
  detected_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When location was detected',
  is_current        BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Is this the current location',
 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_current (is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Current location tracking for nearby kitchen discovery';
`;

  cloud_kitchens = `CREATE TABLE cloud_kitchens (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  kitchen_uid       VARCHAR(20) NOT NULL UNIQUE,
  name              VARCHAR(150) NOT NULL,
  city              VARCHAR(100) NOT NULL,
  pincode           CHAR(6) NOT NULL,
  state             VARCHAR(100) NOT NULL,
  region            VARCHAR(100) NOT NULL,
  permanent_address TEXT NOT NULL,
  status            ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_region (region),
  INDEX idx_status (status)
);`;


  food_classes = `CREATE TABLE food_classes (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(50) NOT NULL UNIQUE COMMENT 'VEG, NON_VEG, VEGAN, etc.'
);

INSERT INTO food_classes (name) VALUES ('VEG'), ('EGG'), ('NON_VEG'), ('VEGAN'), ('JAIN'), ('SEAFOOD');
`;


  food_types = `CREATE TABLE food_types (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(50) NOT NULL UNIQUE COMMENT 'SNACKS, MEAL, DESSERT, etc.'
);

INSERT INTO food_types (name) VALUES ('SNACKS'), ('MEAL'), ('BEVERAGE'), ('DESSERT'), ('SALAD'), ('SOUP'), ('APPETIZER');
`;


  menu_categories = `CREATE TABLE menu_categories (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL UNIQUE COMMENT 'STARTERS, BIRYANI, SOUTH_INDIAN, etc.'
);

INSERT INTO menu_categories (name) VALUES  ('STARTERS'), ('MAIN_COURSE'), ('RICE'), ('BIRYANI'), ('ROTI_NAAN'), ('SNACKS'), ('FAST_FOOD'), ('STREET_FOOD'), ('SOUTH_INDIAN'), ('NORTH_INDIAN'), ('CHINESE'), ('CONTINENTAL'), ('ITALIAN'), ('MEXICAN'), ('MIDDLE_EASTERN'), ('SEAFOOD'), ('SALADS'), ('SOUPS'), ('DESSERTS'), ('BAKERY'), ('BEVERAGES'), ('COMBOS'), ('KIDS_MENU'), ('HEALTHY'), ('SPECIALS');
`;


  kitchen_menu_items = `CREATE TABLE kitchen_menu_items (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  kitchen_id        BIGINT NOT NULL,
  item_name         VARCHAR(150) NOT NULL,
  description       TEXT COMMENT 'Menu item description like ingredients, special notes, etc.',
  image_url         VARCHAR(500) COMMENT 'URL to the menu item image',
  food_class_id     INT NOT NULL,
  food_type_id      INT NOT NULL,
  category_id       INT NOT NULL,
  price             DECIMAL(10,2) NOT NULL,
  is_customizable   BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Supports customization',
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Featured on home page',
  is_international  BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'International cuisine for home page',
  is_special        BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Special cuisine for home page',
  status            BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'true means available',
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (kitchen_id) REFERENCES cloud_kitchens(id) ON DELETE CASCADE,
  FOREIGN KEY (food_class_id) REFERENCES food_classes(id),
  FOREIGN KEY (food_type_id) REFERENCES food_types(id),
  FOREIGN KEY (category_id) REFERENCES menu_categories(id),

  INDEX idx_kitchen (kitchen_id),
  INDEX idx_food_class (food_class_id),
  INDEX idx_food_type (food_type_id),
  INDEX idx_category (category_id),
  INDEX idx_customizable (is_customizable),
  INDEX idx_featured (is_featured),
  INDEX idx_international (is_international),
  INDEX idx_special (is_special),
  INDEX idx_status (status)
);
`;

  subscription_plans = `CREATE TABLE subscription_plans (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  plan_code       ENUM('WEEKLY','BIWEEKLY','MONTHLY','QUARTERLY') NOT NULL UNIQUE,
  plan_name       VARCHAR(50) NOT NULL,
  description     TEXT,
  duration_days   INT NOT NULL,
  base_price      DECIMAL(10,2) NOT NULL COMMENT 'Base price without customisations',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

  user_subscriptions = `CREATE TABLE user_subscriptions (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT NOT NULL,
  plan_id         BIGINT NOT NULL,
  base_price      DECIMAL(10,2) NOT NULL COMMENT 'Copied from subscription_plans.base_price',
  final_price     DECIMAL(10,2) NOT NULL COMMENT 'Base price + customisation price',
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  status          ENUM('ACTIVE','PAUSED','EXPIRED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  paused_at       TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),

  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
`;

  subscription_preferences = `CREATE TABLE subscription_preferences (
  id                    BIGINT PRIMARY KEY AUTO_INCREMENT,
  subscription_id       BIGINT NOT NULL,

  -- Dietary Preferences
  diet_type             ENUM('VEGETARIAN','NON_VEGETARIAN','VEGAN','EGGETARIAN','OTHER') NOT NULL,
  diet_other_text       VARCHAR(255),

  -- Cuisine Type
  cuisine_type          ENUM(
                          'ANDHRA','GUJARATI','MAHARASHTRIAN','PUNJABI','BENGALI',
                          'TAMIL','KERALA','RAJASTHANI','KASHMIRI',
                          'NORTH_INDIAN','SOUTH_INDIAN','CHINESE','CONTINENTAL','OTHER'
                        ) NOT NULL,

  -- Meal Type
  meal_type             ENUM('BREAKFAST','LUNCH','DINNER','SNACKS','FULL_DAY') NOT NULL,

  -- Portion & Spice
  portion_size          ENUM('SMALL','MEDIUM','LARGE') NOT NULL,
  spice_level           ENUM('MILD','MEDIUM','EXTRA_SPICY') NOT NULL,

  -- Health & Nutrition
  health_goal           ENUM(
                          'LOW_CALORIE','HIGH_PROTEIN','KETO_LOW_CARB',
                          'BALANCED','SUGAR_FREE','LOW_SODIUM'
                        ),
  health_notes          VARCHAR(255),

  -- Allergens
  allergen_main         ENUM(
                          'DAIRY_FREE','NUT_FREE','GLUTEN_FREE',
                          'SOY_FREE','EGG_FREE','OTHER'
                        ),
  allergen_other_text   VARCHAR(255),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE
);
`;


  subscription_customisation_prices = `CREATE TABLE subscription_customisation_prices (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  custom_type     ENUM(
                    'DIET',
                    'CUISINE',
                    'MEAL_TYPE',
                    'PORTION_SIZE',
                    'SPICE_LEVEL',
                    'HEALTH_GOAL',
                    'ALLERGEN'
                  ) NOT NULL,
  custom_value    VARCHAR(100) NOT NULL,
  price_delta     DECIMAL(10,2) NOT NULL COMMENT 'Positive or negative adjustment',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,

  UNIQUE KEY uq_custom_price (custom_type, custom_value)
);
`;

  subscription_payments = `CREATE TABLE subscription_payments (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  subscription_id   BIGINT NOT NULL,
  plan_amount       DECIMAL(10,2) NOT NULL COMMENT 'Final subscription price',
  packing_fee       DECIMAL(10,2) DEFAULT 0,
  delivery_fee      DECIMAL(10,2) DEFAULT 0,
  discount_amount   DECIMAL(10,2) DEFAULT 0,
  tax_amount        DECIMAL(10,2) DEFAULT 0,
  total_amount      DECIMAL(10,2) NOT NULL,
  payment_status    ENUM('PENDING','SUCCESS','FAILED') NOT NULL,
  payment_method    VARCHAR(50),
  transaction_id    VARCHAR(100),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE
);
`;



  subscription_drafts = `CREATE TABLE subscription_drafts (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT NOT NULL,
  plan_id         BIGINT NOT NULL,
  draft_data      JSON NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
}
