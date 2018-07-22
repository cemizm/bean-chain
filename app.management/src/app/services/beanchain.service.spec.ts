import { TestBed, inject } from '@angular/core/testing';

import { BeanchainService } from './beanchain.service';

describe('BeanchainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeanchainService]
    });
  });

  it('should be created', inject([BeanchainService], (service: BeanchainService) => {
    expect(service).toBeTruthy();
  }));
});
