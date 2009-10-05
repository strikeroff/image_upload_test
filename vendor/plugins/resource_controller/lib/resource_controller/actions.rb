module ResourceController
  module Actions
    def index
      load_collection
      before :index
      response_for :index
    end

    def show
      load_object
      before :show
      response_for :show
    rescue ActiveRecord::RecordNotFound
      response_for :show_fails
    end

    def create
      end_of_association_chain.transaction do
        build_object
        load_object
        before :create
        if object.save
          after :create
          set_flash :create
          response_for :create
        else
          after :create_fails
          set_flash :create_fails
          response_for :create_fails
        end
      end
    end

    def update
      end_of_association_chain.transaction do
        load_object
        before :update
        if object.update_attributes object_params
          after :update
          set_flash :update
          response_for :update
        else
          after :update_fails
          set_flash :update_fails
          response_for :update_fails
        end
      end
    end

    def new
      end_of_association_chain.transaction do
        build_object
        load_object
        before :new_action
        response_for :new_action
      end
    end

    def edit
      load_object
      before :edit
      response_for :edit
    end

    def destroy
      end_of_association_chain.transaction do
        load_object
        before :destroy
        if object.destroy
          after :destroy
          set_flash :destroy
          response_for :destroy
        else
          after :destroy_fails
          set_flash :destroy_fails
          response_for :destroy_fails
        end
      end
    end

    def update_attribute
      end_of_association_chain.transaction do
        load_object
        object_params = {params[:attribute] => params[:value]}
        object.update_attributes object_params
        render :json=>{:result=>:success}
      end
    end

    def update_attributes
      end_of_association_chain.transaction do
        load_object
        result = "error"
        if !params[:value].blank? && params[:value].json?
          result = "OK" if object.update_attributes(ActiveSupport::JSON.decode(params[:value]))
        end
        render :text=>result
      end
    end

    def show_attribute
      @object = object
      @object = @object.send params[:attribute]
      response_for :show
    rescue ActiveRecord::RecordNotFound
      response_for :show_fails
    end
  end
end
