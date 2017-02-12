using System;

namespace Esf.DataAccess.Tests
{
    public class EsStateBuilder
    {
        public EsStateBuilder()
        {
            _esState = new EsState();
            _esState.Documents = new string[0];
            _esState.Mapping = "";
            _esState.Query = "";
            _esState.StateUrl = Guid.Empty;
        }


        public EsStateBuilder SetMapping(string mapping)
        {
            _esState.Mapping = mapping;
            return this;
        }

        public EsStateBuilder SetQuery(string query)
        {
            _esState.Query = query;
            return this;
        }

        public EsStateBuilder SetStateUrl(Guid stateUrl)
        {
            _esState.StateUrl = stateUrl;
            return this;
        }

        public EsStateBuilder SetDocuments(string[] documents)
        {
            _esState.Documents = documents;
            return this;
        }

        private EsState _esState;

        public EsState Build()
        {
            return _esState;
        }
    }
}
