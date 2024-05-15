import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedGuard, notLoggedGuard } from './auth.guard';

describe('authGuard', () => {
  const executeLoggedGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loggedGuard(...guardParameters));

  const executeNotLoggedGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => notLoggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeLoggedGuard).toBeTruthy();
    expect(executeNotLoggedGuard).toBeTruthy();
  });
});
