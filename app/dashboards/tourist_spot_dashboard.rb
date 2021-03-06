require "administrate/base_dashboard"

class TouristSpotDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    name: Field::String,
    description: Field::Text,
    location: Field::String,
    rank: Field::Number,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    picture: Field::Carrierwave
}.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :name,
    :description,
    :location,
    :rank
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :name,
    :description,
    :location,
    :rank,
    :created_at,
    :updated_at,
    :picture,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :name,
    :description,
    :location,
    :rank,
    :picture,
  ].freeze

  # Overwrite this method to customize how tourist spots are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(tourist_spot)
  #   "TouristSpot ##{tourist_spot.id}"
  # end
end
