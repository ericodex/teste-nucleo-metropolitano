import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { UsersComponent } from './users.component';
import { AutenticacaoService } from '../../core/api/services/autenticacao.service';
import { AuthService } from '../../core/services/auth.service';
import { ComGestaoprodutosModelEntityUsuario as Usuario } from '../../core/api/models';
import { HttpErrorResponse } from '@angular/common/http';

class MockAuthService {
  logout = jasmine.createSpy('logout').and.callFake(() => {
    TestBed.inject(Router).navigate(['/auth/login']);
  });
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockAutenticacaoService {
  listAllUsersSubject = new Subject<Usuario[]>();
  listAllUsers = jasmine
    .createSpy('listAllUsers')
    .and.returnValue(this.listAllUsersSubject.asObservable());
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockAutenticacaoService: MockAutenticacaoService;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: AutenticacaoService, useClass: MockAutenticacaoService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    mockAutenticacaoService = TestBed.inject(
      AutenticacaoService
    ) as unknown as MockAutenticacaoService;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('deve ser criado', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve chamar loadUsers em ngOnInit', () => {
    spyOn(component, 'loadUsers').and.callThrough();
    fixture.detectChanges();
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('deve carregar usuários com sucesso', () => {
    const mockUsers: Usuario[] = [
      {
        id: 1,
        nome: 'Usuário Teste 1',
        email: 'test1@example.com',
        cpf: '111.111.111-11',
        role: 'USER',
        senha: ''
      },
      {
        id: 2,
        nome: 'Usuário Teste 2',
        email: 'test2@example.com',
        cpf: '222.222.222-22',
        role: 'ADMIN',
        senha: ''
      },
    ];
    mockAutenticacaoService.listAllUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
    expect(component.users).toEqual(mockUsers);
  });

  it('deve exibir mensagem de "Nenhum usuário encontrado" quando a lista estiver vazia', () => {
    mockAutenticacaoService.listAllUsers.and.returnValue(of([]));

    fixture.detectChanges();

    const noUsersMessage =
      fixture.nativeElement.querySelector('.no-users-message');
    expect(noUsersMessage).toBeTruthy();
    expect(noUsersMessage.textContent).toContain('Nenhum usuário encontrado.');
    expect(component.isLoading).toBeFalse();
    expect(component.users.length).toBe(0);
  });

  it('deve exibir mensagem de carregamento durante o carregamento', () => {
    fixture.detectChanges();

    expect(component.isLoading).toBeTrue();
    let loadingMessage =
      fixture.nativeElement.querySelector('.loading-message');
    expect(loadingMessage).toBeTruthy();
    expect(loadingMessage.textContent).toContain('Carregando usuários...');

    mockAutenticacaoService.listAllUsersSubject.next([]);
    mockAutenticacaoService.listAllUsersSubject.complete();
    fixture.detectChanges();

    loadingMessage = fixture.nativeElement.querySelector('.loading-message');
    expect(loadingMessage).toBeFalsy();
  });

  it('deve lidar com erro ao carregar usuários e exibir mensagem de erro', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });
    mockAutenticacaoService.listAllUsers.and.returnValue(
      throwError(() => errorResponse)
    );

    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).not.toBeNull();
    expect(component.errorMessage).toContain(
      'Não foi possível carregar os usuários.'
    );
    expect(component.users).toEqual([]);

    const errorMessageElement =
      fixture.nativeElement.querySelector('.error-alert');
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain(
      'Não foi possível carregar os usuários.'
    );
  });

  it('deve redirecionar para login em caso de erro 401', () => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });
    mockAutenticacaoService.listAllUsers.and.returnValue(
      throwError(() => errorResponse)
    );

    fixture.detectChanges();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.errorMessage).toContain(
      'Sessão expirada ou não autorizado. Por favor, faça login novamente.'
    );
  });

  it('deve redirecionar para login em caso de erro 403', () => {
    const errorResponse = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
    });
    mockAutenticacaoService.listAllUsers.and.returnValue(
      throwError(() => errorResponse)
    );

    fixture.detectChanges();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.errorMessage).toContain(
      'Sessão expirada ou não autorizado. Por favor, faça login novamente.'
    );
  });
});
