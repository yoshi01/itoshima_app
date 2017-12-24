class MapController < ApplicationController
  def index
    @tourist_spots = TouristSpot.all
    @courses = Course.all
    @hash = Gmaps4rails.build_markers(@tourist_spots) do |tourist_spot, marker|
      marker.lat tourist_spot.latitude
      marker.lng tourist_spot.longitude
      marker.infowindow render_to_string( partial: "map/infowindow",
                                          locals: { tourist_spot: tourist_spot}
                                        )
      marker.picture({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        width: 32,
        height: 32
      });
    end
  end
end
