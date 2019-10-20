import { WebDocument } from '../../web-audit'
import { auditCommonSemantics, auditHeaderSemantics, auditTextSemantics } from '../semantic'

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

describe('auditHeaderSemantics', ()=>{
  it('document has some headers',()=>{
    let inc = 0;
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn(()=>++inc)
    }
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document does not have any headers',()=>{
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn(()=>0)
    }
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document has two h1',()=>{
    const document:WebDocument = {
      getElementsByTagNameCount:jest.fn((tag)=>tag === 'h1'?2:0)
    }
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
});
