import { Location } from '../../models';
import { ILocation } from './types';

export class LocationServices {
  static async getLocations() {
    const locations = await Location.find({});
    return locations;
  }

  static async getLocation(locationId: string) {
    const location = await Location.findById({ locationId });
    return location;
  }

  static async create(location: ILocation) {
    // проверим что в указанный день этому педагогу не назначен другой урок
    const candidate = await Location.findOne({
      title: location.title,
      address: location.address,
    });

    if (candidate) {
      return null;
    }

    const newLocation = await Location.create(location);

    return newLocation;
  }

  static async update(id: string, location: ILocation) {
    const updatedLocation = await Location.findOneAndUpdate({ id }, location, { returnDocument: 'after' });
    return updatedLocation;
  }

  static async delete(id: string) {
    const removedLocation = await Location.findOneAndDelete({ id });
    return removedLocation;
  }
}
