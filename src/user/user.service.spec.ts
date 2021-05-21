import { SinonStub } from 'sinon';
import { PaginationRespDTO } from 'src/app.dto';
import * as CryptoHelper from '../helper/crypto-helper';
import { genUsers } from 'test/helpers/dummy-generators';
import { loadSandbox } from 'test/helpers/load-sandbox';
import { User } from './user.model';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  describe('#findOne', () => {
    let getOneStub: SinonStub;

    loadSandbox((testSandbox) => {
      getOneStub = testSandbox.stub(UserModule.instance, 'getOne');
    });

    it('Return one user', async () => {
      const user = genUsers()[0];
      getOneStub.resolves(user);

      const result = await UserService.findOne(user._id.toHexString());
      expect(getOneStub.calledWith({ _id: user._id })).toBeTruthy();
      expect(result).toEqual(user);
    });
  });

  describe('#updateOne', () => {
    let updateOneStub: SinonStub;

    loadSandbox((testSandbox) => {
      updateOneStub = testSandbox.stub(UserModule.instance, 'updateOne');
    });

    it('Return one user', async () => {
      const user = genUsers()[0];
      const updateDoc = { name: user.name } as User;
      updateOneStub.resolves(user);

      const result = await UserService.updateOne(user._id, updateDoc);
      expect(updateOneStub.calledWith(updateDoc, { _id: user._id }, { returnOriginal: false })).toBeTruthy();
      expect(result).toEqual(user);
    });
  });

  describe('#createOne', () => {
    let insertOneStub: SinonStub;

    loadSandbox((testSandbox) => {
      insertOneStub = testSandbox.stub(UserModule.instance, 'insertOne');
    });

    it('Return one user', async () => {
      const user = genUsers()[0];
      insertOneStub.resolves([user]);

      const result = await UserService.createOne(user);
      expect(insertOneStub.calledWith(user)).toBeTruthy();
      expect(result).toEqual(user);
    });
  });

  describe('#deleteOne', () => {
    let updateOneStub: SinonStub;

    loadSandbox((testSandbox) => {
      updateOneStub = testSandbox.stub(UserModule.instance, 'updateOne');
    });

    it('Return one user', async () => {
      const user = genUsers()[0];
      updateOneStub.resolves([user]);

      const result = await UserService.createOne(user);
      expect(updateOneStub.calledWith({ deleted: true }, { _id: user._id }, { returnOriginal: false })).toBeTruthy();
      expect(result).toEqual(user);
    });
  });

  describe('#nearBy', () => {
    let getOneStub: SinonStub;
    let getWithCountStub: SinonStub;
    let formatScrollIdStub: SinonStub;

    loadSandbox((testSandbox) => {
      getOneStub = testSandbox.stub(UserModule.instance, 'getOne');
      getWithCountStub = testSandbox.stub(UserModule.instance, 'getWithCount');
      formatScrollIdStub = testSandbox.stub(CryptoHelper, 'formatScrollId');
    });

    it('throw badRequest if user name is not exist', async () => {
      getOneStub.resolves(undefined);
      expect(UserService.nearBy({ name: 'allison' })).rejects.toThrow('Invalid user name!');
    });

    it('return empty value if searching user owns the empty address', async () => {
      const user = genUsers()[0];
      user.address = null;
      getOneStub.resolves(user);

      const result = await UserService.nearBy({ name: user.name });
      expect(result).toEqual(new PaginationRespDTO([], null, 0));
    });

    it('return nearby user list', async () => {
      const user = genUsers()[0];
      getOneStub.resolves(user);
      
      const total = 10;
      const data = genUsers(total);
      getWithCountStub.resolves({ data, count: total });

      formatScrollIdStub.returns(null);

      const result = await UserService.nearBy({ name: user.name });
      expect(result).toEqual(new PaginationRespDTO(data, null, total));
    });
  });
});