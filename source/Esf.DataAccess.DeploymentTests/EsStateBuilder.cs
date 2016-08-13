using System;

namespace Esf.DataAccess.Tests
{
    public class EsStateBuilder
    {
        public EsStateBuilder()
        {
            _esState = new EsState();
            _esState.Documents = "";
            _esState.Mapping = "";
            _esState.Query = "";
            _esState.StateUrl = Guid.Empty;
        }

        public EsStateBuilder SetDocuments(params string[] documents)
        {
            return this;
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

        private EsState _esState;

        public EsState Build()
        {
            return _esState;
        }
    }
}
