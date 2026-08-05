import { TestBed } from '@angular/core/testing';

import { ComponentDataSharingService } from './component-data-sharing.service';

describe('ComponentDataSharingService', () => {
  let service: ComponentDataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentDataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
