import { WebDocument } from '../../web-audit'
import { auditCommonSemantics, auditTextSemantics } from '../semantic'

describe('auditCommonSemantics', ()=>{
  it('document has each common elements',()=>{
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn(()=>1)
    }
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
  it('document has two main tags',()=>{
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn((tag)=>tag === 'main' ? 2 : 1)
    }
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });

  it('document does not have any common tag',()=>{
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn(()=>0)
    }
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
});

it('auditTextSemantics', ()=>{
  let inc = 0;
  const document:WebDocument = {
    getElementsByTagNameCount:jest.fn(()=>++inc)
  }
  expect(auditTextSemantics(document)).toMatchSnapshot();
})
