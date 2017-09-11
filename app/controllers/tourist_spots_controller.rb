class TouristSpotsController < ApplicationController
  before_action :set_tourist_spot, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only: [:new, :edit, :create, :update, :destroy]

  # GET /tourist_spots
  # GET /tourist_spots.json
  def index
    @tourist_spots = TouristSpot.page(params[:page])
  end

  # GET /tourist_spots/1
  # GET /tourist_spots/1.json
  def show
  end

  # GET /tourist_spots/new
  def new
    @tourist_spot = TouristSpot.new
  end

  # GET /tourist_spots/1/edit
  def edit
  end

  # POST /tourist_spots
  # POST /tourist_spots.json
  def create
    @tourist_spot = TouristSpot.new(tourist_spot_params)

    respond_to do |format|
      if @tourist_spot.save
        format.html { redirect_to @tourist_spot, notice: 'Tourist spot was successfully created.' }
        format.json { render :show, status: :created, location: @tourist_spot }
      else
        format.html { render :new }
        format.json { render json: @tourist_spot.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tourist_spots/1
  # PATCH/PUT /tourist_spots/1.json
  def update
    respond_to do |format|
      if @tourist_spot.update(tourist_spot_params)
        format.html { redirect_to @tourist_spot, notice: 'Tourist spot was successfully updated.' }
        format.json { render :show, status: :ok, location: @tourist_spot }
      else
        format.html { render :edit }
        format.json { render json: @tourist_spot.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tourist_spots/1
  # DELETE /tourist_spots/1.json
  def destroy
    @tourist_spot.destroy
    respond_to do |format|
      format.html { redirect_to root_path, notice: 'Tourist spot was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tourist_spot
      @tourist_spot = TouristSpot.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tourist_spot_params
      params.require(:tourist_spot).permit(:name, :description, :location, :picture)
    end
end
