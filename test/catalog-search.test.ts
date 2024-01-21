import { CatalogSearch } from '@app/static/catalog-search';
import { SpaceObjectType } from 'ootk';
import { defaultSat } from './environment/apiMocks';

describe('CatalogSearch_class', () => {
  const satData = [
    {
      ...defaultSat,
      ...{
        id: 1,
        name: 'ISS (ZARYA)',
        country: 'USA',
        shape: 'SPHERICAL',
        bus: 'TRASH CAN',
        type: SpaceObjectType.PAYLOAD,
      },
    },
    {
      ...defaultSat,
      ...{
        TLE1: '1 25544U 01067A   98286.88032407  .00000000  00000-0  10000-3 0  9999',
        name: 'TERRA',
        country: 'CAN',
        shape: 'CONE',
        bus: 'A2100',
        type: SpaceObjectType.ROCKET_BODY,
      },
    },
  ];

  // Tests that year method filters correctly based on year
  it('test_year_filters_correctly', () => {
    const filteredData = CatalogSearch.year(satData as any, 98);
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].id).toBe(1);
  });

  // Tests that yearOrLess method filters correctly based on year
  it('test_year_or_less_filters_correctly', () => {
    const filteredData = CatalogSearch.yearOrLess(satData as any, 99);
    expect(filteredData.length).toBe(1);
  });

  // Tests that yearOrLess method filters correctly when year greater than 99
  it('test_year_or_less_filters_correctly_when_year_greater_than_99', () => {
    const filteredData = CatalogSearch.yearOrLess(satData as any, 2);
    expect(filteredData.length).toBe(2);
  });

  // Tests that objectName method filters correctly based on object name
  it('test_object_name_filters_correctly', () => {
    const filteredData = CatalogSearch.objectName(satData as any, /ISS/u);
    expect(filteredData.length).toBe(1);
  });

  // Tests that country method filters correctly based on country
  it('test_country_filters_correctly', () => {
    const filteredData = CatalogSearch.country(satData as any, /USA/u);
    expect(filteredData.length).toBe(1);
  });

  // Tests that shape method filters correctly based on shape
  it('test_shape_filters_correctly', () => {
    const filteredData = CatalogSearch.shape(satData as any, 'SPHERICAL');
    expect(filteredData.length).toBe(1);
  });

  // Tests that bus method filters correctly based on bus
  it('test_bus_filters_correctly', () => {
    const filteredData = CatalogSearch.bus(satData as any, 'A2100');
    expect(filteredData.length).toBe(1);
  });

  // Tests that type method filters correctly based on type
  it('test_type_filters_correctly', () => {
    const filteredData = CatalogSearch.type(satData as any, SpaceObjectType.PAYLOAD as SpaceObjectType);
    expect(filteredData.length).toBe(1);
  });
});
