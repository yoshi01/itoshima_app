class MapController < ApplicationController
  def index
    @tourist_spots = TouristSpot.all
    @hash = Gmaps4rails.build_markers(@tourist_spots) do |tourist_spot, marker|
      marker.lat tourist_spot.latitude
      marker.lng tourist_spot.longitude
      marker.infowindow tourist_spot.name
    end
  end
end
